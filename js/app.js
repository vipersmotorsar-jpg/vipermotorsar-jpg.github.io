document.addEventListener("DOMContentLoaded", () => {
  loadFeaturedMotos();
});

async function loadFeaturedMotos() {
  try {
    const response = await fetch("data/motos.json");
    const motos = await response.json();
    
    const container = document.getElementById("destacadas-grid");
    if (!container) return;

    const destacadas = motos.filter(m => m.destacada && m.publicar);

    container.innerHTML = destacadas.map(moto => {
      const precioFormateado = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(moto.precio);
      const isConsignacion = moto.tipo_publicacion === "CONSIGNACIÓN";
      const badgeTipoClass = isConsignacion ? "badge-tipo" : "badge-tipo";
      
      return `
        <div class="moto-card" onclick="window.location.href='moto.html?id=${moto.id}'" style="cursor: pointer;">
          <div class="moto-card-img">
            <div class="badge-vipers-check">
              <span class="dot"></span> VIPERS CHECK ${moto.vipers_check}
            </div>
            <div class="badge-tipo">${moto.tipo_publicacion}</div>
            <i class="fas fa-motorcycle" style="font-size: 3rem; color: #333;"></i>
          </div>
          <div class="moto-card-body">
            <h3 class="moto-card-title">${moto.marca} ${moto.modelo}</h3>
            <div class="moto-card-specs">
              <span><i class="far fa-calendar-alt"></i> ${moto.anio}</span>
              <span><i class="fas fa-tachometer-alt"></i> ${moto.kilometros.toLocaleString()} KM</span>
            </div>
            <div class="moto-card-price">${precioFormateado}</div>
            <div class="moto-card-meta">
              <span><i class="fas fa-map-marker-alt"></i> ${moto.ubicacion}</span>
              <span>${moto.acepta_permuta ? '🔄 Permuta' : ''}</span>
            </div>
            <div class="moto-card-footer">
              <button class="btn-outline" style="width: 100%; font-size: 0.95rem; padding: 0.6rem;">
                VER MOTO →
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");

  } catch (error) {
    console.error("Error cargando motos destacadas:", error);
  }
}
