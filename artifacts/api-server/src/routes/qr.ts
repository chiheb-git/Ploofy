import { Router, type IRouter } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { desc } from "drizzle-orm";
import { db, qrCodesTable } from "@workspace/db";
import QRCode from "qrcode";

// Configure Cloudinary from env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router: IRouter = Router();

function formatQr(q: typeof qrCodesTable.$inferSelect) {
  return {
    id: q.id,
    label: q.label,
    targetUrl: q.targetUrl,
    pngBase64: q.pngBase64,
    createdAt: q.createdAt.toISOString(),
  };
}

router.get("/qr", async (req, res): Promise<void> => {
  const [qr] = await db
    .select()
    .from(qrCodesTable)
    .orderBy(desc(qrCodesTable.createdAt))
    .limit(1);
  if (!qr) {
    res.status(200).json({ exists: false });
    return;
  }
  res.json(formatQr(qr));
});

router.post("/qr/generate", async (req, res): Promise<void> => {
  const menuUrl = process.env.MENU_URL ?? "";
  if (!menuUrl) {
    res.status(500).json({ error: "MENU_URL is not configured" });
    return;
  }
  try {
    const pngBase64 = await QRCode.toDataURL(menuUrl, {
      width: 500,
      margin: 2,
      color: { dark: "#0F0F0F", light: "#FFFFFF" },
    });
    const [qr] = await db
      .insert(qrCodesTable)
      .values({
        label: "Menu QR Code",
        targetUrl: menuUrl,
        pngBase64,
      })
      .returning();
    res.status(201).json(formatQr(qr));
  } catch (err) {
    req.log.error({ err }, "Failed to generate QR code");
    res.status(500).json({ error: "Failed to generate QR code" });
    return;
  }
});

// Upload endpoint for images (Cloudinary)
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), async (req, res): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: "No file provided" });
    return;
  }

  try {
    const streamUpload = (buffer: Buffer) =>
      new Promise<{ secure_url: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "dishes" },
          (error, result) => {
            if (error) return reject(error);
            // @ts-ignore
            resolve(result);
          }
        );
        // write buffer and end
        uploadStream.end(buffer);
      });

    const result = await streamUpload(req.file.buffer);
    res.status(201).json({ url: result.secure_url });
  } catch (err) {
    req.log?.error?.({ err }, "Cloudinary upload failed");
    res.status(500).json({ error: "Failed to upload image" });
  }
});

router.get("/qr/download", async (req, res): Promise<void> => {
  const [qr] = await db
    .select()
    .from(qrCodesTable)
    .orderBy(desc(qrCodesTable.createdAt))
    .limit(1);
  if (!qr?.pngBase64) {
    res.status(404).json({ error: "No QR code found" });
    return;
  }
  const base64Data = qr.pngBase64.replace(/^data:image\/png;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Content-Disposition", "attachment; filename=menu-qr.png");
  res.send(buffer);
});

export default router;
