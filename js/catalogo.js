let allMotos = [];

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("data/motos.json");
    allMotos = await response.json();

    // Check URL params for category filter
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('cat');
    if (catParam) {
      const selectCat = document.getElementById("filter-categoria");
      if (selectCat) selectCat.value = catParam;
    }

    renderCatalog(allMotos);

    // Event listeners for filters
    document.getElementById("filter-marca").addEventListener("change", filterMotos);
    document.getElementById("filter-categoria").addEventListener("change", filterMotos);
    document.getElementById("filter-estado").addEventListener("change", filterMotos);
    document.getElementById("filter-search").addEventListener("input", filterMotos);
    document.getElementById("sort-by").addEventListener("change", filterMotos);
    document.getElementById("btn-reset-filters").addEventListener("click", resetFilters);

  } catch (error) {
    console.error("Error al cargar el catálogo:", error);
  }
});

function filterMotos() {
  const marca = document.getElementById("filter-marca").value.toLowerCase();
  const categoria = document.getElementById("filter-categoria").value.toLowerCase();
  const estado = document.getElementById("filter-estado").value;
  const search = document.getElementById("filter-search").value.toLowerCase();
  const sortBy = document.getElementById("sort-by").value;

  let filtered = allMotos.filter(moto => {
    if (!moto.publicar) return false;
    if (marca && moto.marca.toLowerCase() !== marca) return false;
    if (categoria && moto.categoria !== categoria) return false;
    if (estado && moto.estado !== estado) return false;
    if (search && !(`${moto.marca} ${moto.modelo}`.toLowerCase().includes(search))) return false;
    return true;
  });

  // Sorting
  if (sortBy === "recientes") {
    filtered.sort((a, b) => new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion));
  } else if (sortBy === "precio-menor") {
    filtered.sort((a, b) => a.precio - b.precio);
  } else if (sortBy === "precio-mayor") {
    filtered.sort((a, b) => b.precio - a.precio);
  } else if (sortBy === "km") {
    filtered.sort((a, b) => a.kilometros - b.kilometros);
  }

  renderCatalog(filtered);
}

function renderCatalog(motos) {
  const container = document.getElementById("catalog-grid");
  const countSpan = document.getElementById("results-count");

  countSpan.textContent = `Mostrando ${motos.length} ${motos.length === 1 ? 'moto' : 'motos'}`;

  if (motos.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted); grid-column: 1 / -1; text-align: center; padding: 3rem;">No se encontraron motos con los filtros seleccionados.</p>`;
    return;
  }

  container.innerHTML = motos.map(moto => {
    const precioFormateado = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(moto.precio);
    
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
}

function resetFilters() {
  document.getElementById("filter-marca").value = "";
  document.getElementById("filter-categoria").value = "";
  document.getElementById("filter-estado").value = "DISPONIBLE";
  document.getElementById("filter-search").value = "";
  document.getElementById("sort-by").value = "recientes";
  filterMotos();
}

function handleFormSubmit(e) {
  e.preventDefault();
  document.getElementById("vende-form").style.display = "none";
  document.getElementById("form-success").style.display = "block";
}
