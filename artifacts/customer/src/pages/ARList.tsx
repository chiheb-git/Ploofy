import { Link } from "wouter";
import { useListDishes } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Box } from "lucide-react";

export default function ARList() {
  const { data: dishesRaw, isLoading } = useListDishes({});
  const dishes = (Array.isArray(dishesRaw) ? dishesRaw : dishesRaw?.data ?? []).filter(
    (d) => d.modelGlbUrl && d.isAvailable
  );

  return (
    <div className="flex flex-col w-full min-h-screen pb-6">

      {/* Header */}
      <div style={{
        padding:"32px 20px 20px",
        borderBottom:"1px solid rgba(255,255,255,0.06)"
      }}>
        <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"6px"}}>
          <div style={{
            width:"36px",height:"36px",borderRadius:"10px",
            background:"rgba(201,168,76,0.15)",border:"1px solid rgba(201,168,76,0.3)",
            display:"flex",alignItems:"center",justifyContent:"center"
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
          </div>
          <div>
            <h1 style={{fontSize:"20px",fontWeight:700,color:"#fff",margin:0,fontFamily:"serif"}}>Vue 3D / AR</h1>
            <p style={{fontSize:"11px",color:"rgba(255,255,255,0.35)",margin:0,letterSpacing:"0.05em"}}>
              Explorez nos plats en réalité augmentée
            </p>
          </div>
        </div>
      </div>

      {/* List */}
      <div style={{padding:"16px",display:"flex",flexDirection:"column",gap:"12px"}}>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{display:"flex",gap:"12px",alignItems:"center",padding:"12px",borderRadius:"16px",background:"rgba(255,255,255,0.04)"}}>
              <Skeleton className="w-20 h-20 rounded-xl flex-shrink-0" />
              <div style={{flex:1,display:"flex",flexDirection:"column",gap:"8px"}}>
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))
        ) : dishes.length === 0 ? (
          <div style={{textAlign:"center",padding:"60px 20px",color:"rgba(255,255,255,0.3)"}}>
            <div style={{fontSize:"40px",marginBottom:"12px"}}>📦</div>
            <p style={{fontSize:"14px"}}>Aucun modèle 3D disponible</p>
          </div>
        ) : (
          dishes.map((dish) => (
            <Link key={dish.id} href={"/ar/" + dish.id}>
              <div style={{
                display:"flex",gap:"14px",alignItems:"center",
                padding:"14px",borderRadius:"18px",
                background:"rgba(255,255,255,0.04)",
                border:"1px solid rgba(255,255,255,0.07)",
                cursor:"pointer",
                transition:"all 0.2s"
              }}>
                {/* Image */}
                <div style={{
                  width:"76px",height:"76px",borderRadius:"14px",
                  overflow:"hidden",flexShrink:0,
                  border:"1px solid rgba(255,255,255,0.08)"
                }}>
                  <img
                    src={dish.imageUrl || "/placeholder-pizza.png"}
                    alt={dish.name}
                    style={{width:"100%",height:"100%",objectFit:"cover"}}
                  />
                </div>

                {/* Info */}
                <div style={{flex:1,minWidth:0}}>
                  <h3 style={{
                    fontSize:"15px",fontWeight:700,color:"#fff",
                    margin:"0 0 4px",fontFamily:"serif",
                    whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"
                  }}>{dish.name}</h3>
                  <p style={{
                    fontSize:"11px",color:"rgba(255,255,255,0.4)",
                    margin:"0 0 8px",
                    whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"
                  }}>{dish.description}</p>
                  <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                    <span style={{
                      fontSize:"9px",color:"rgba(201,168,76,0.9)",
                      letterSpacing:"0.15em",textTransform:"uppercase",
                      background:"rgba(201,168,76,0.1)",
                      border:"1px solid rgba(201,168,76,0.25)",
                      padding:"2px 8px",borderRadius:"20px",fontWeight:600
                    }}>3D AR</span>
                    <span style={{fontSize:"13px",color:"rgba(201,168,76,0.85)",fontWeight:700}}>
                      {dish.price ? dish.price + " DZD" : ""}
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <div style={{
                  width:"32px",height:"32px",borderRadius:"50%",flexShrink:0,
                  background:"rgba(201,168,76,0.1)",border:"1px solid rgba(201,168,76,0.25)",
                  display:"flex",alignItems:"center",justifyContent:"center"
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

    </div>
  );
}
