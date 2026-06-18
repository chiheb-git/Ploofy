import { MapPin, Phone, Clock, Instagram } from "lucide-react";

export default function About() {
  return (
    <div className="flex flex-col w-full min-h-screen pb-6">

      {/* Hero */}
      <div className="relative w-full h-64 bg-card border-b border-border">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-4xl font-serif text-white mb-2">SOLARIOS</h1>
          <p className="text-primary font-medium tracking-widest uppercase text-sm">RESTAURANT SOLARIOS</p>
        </div>
      </div>

      <div className="p-6 space-y-6">

        {/* Adresse */}
        <div className="flex items-start gap-4 tap-effect cursor-pointer" onClick={() => window.open('https://maps.app.goo.gl/CtdXYzTKpSbbRBws7', '_blank')}>
          <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center border border-border text-primary shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">Adresse</h3>
            <p className="text-muted-foreground text-sm">
              Boulevard des Freres Bouafia, Bel Air<br />
              (Pres de Natixis), Tlemcen
            </p>
            <p className="text-primary text-xs mt-1 underline">Ouvrir dans Maps</p>
          </div>
        </div>

        {/* Horaires */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center border border-border text-primary shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Horaires d'ouverture</h3>
            <div className="text-muted-foreground text-sm space-y-1">
              <div className="flex justify-between gap-8">
                <span>Sam - Jeu</span>
                <span className="text-foreground">12:00 - 00:00</span>
              </div>
              <div className="flex justify-between gap-8">
                <span>Vendredi</span>
                <span className="text-foreground">17:00 - 00:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Telephone */}
        <div className="flex items-start gap-4 tap-effect cursor-pointer" onClick={() => window.open('tel:+213774304767', '_self')}>
          <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center border border-border text-primary shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">Contact</h3>
            <p className="text-muted-foreground text-sm">0774304767</p>
            <p className="text-primary text-xs mt-1 underline">Appeler maintenant</p>
          </div>
        </div>

        {/* Instagram */}
        <div className="flex items-start gap-4 tap-effect cursor-pointer" onClick={() => window.open('https://www.instagram.com/solarios_restaurant', '_blank')}>
          <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center border border-border text-primary shrink-0">
            <Instagram className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">Instagram</h3>
            <p className="text-primary text-sm font-medium">@SOLARIOS_SOLARIOS RESTAURANT</p>
            <p className="text-muted-foreground text-xs mt-1">10.4K abonnes · Ouvrir Instagram</p>
          </div>
        </div>

        {/* Developer Credit */}
        <div style={{marginTop:"32px",paddingTop:"20px",borderTop:"1px solid rgba(201,168,76,0.12)",textAlign:"center",paddingBottom:"8px"}}>
          <p style={{fontSize:"9px",color:"rgba(255,255,255,0.18)",letterSpacing:"0.22em",textTransform:"uppercase",fontFamily:"Inter, sans-serif",margin:0}}>
            Developed by <span style={{color:"rgba(201,168,76,0.6)",fontWeight:700,letterSpacing:"0.12em"}}>Meghraoui Chiheb</span>
          </p>
        </div>

      </div>
    </div>
  );
}
