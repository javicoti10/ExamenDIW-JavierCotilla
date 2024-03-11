var map;
var currentLocation = null;

// Inicialización del mapa
function initMap() {
    map = L.map('mapa').setView([36.719332, -4.423457], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
}

// Añade un punto al mapa y su correspondiente listener
function addToMap(data) {
    // Verifica si las coordenadas están definidas correctamente
    if (data.geometry && data.geometry.coordinates && data.geometry.coordinates.length >= 2) {
        let lat = data.geometry.coordinates[1]; // Latitud
        let lon = data.geometry.coordinates[0]; // Longitud
        let marker = L.marker([lat, lon]).addTo(map);
        marker.bindPopup(
            `<h3>${data.properties.NOMBRE}</h3>
             <p>${data.properties.DESCRIPCION}</p>
            `);
        marker.addEventListener("click", () => {
            console.log(data.properties.NOMBRE);
            updateInfo(data.properties);
        });
        console.log(marker);

        // Agregar al listado
        addToList(data);
    } else {
        console.log("Error: Coordenadas no definidas correctamente en los datos.");
    }
}

// Actualiza el panel de información
function updateInfo(data) {
    document.querySelector("#info h3").textContent = data.NOMBRE;
    document.querySelector("#info p").textContent = data.DESCRIPCION;
    document.querySelector("#info img").setAttribute("src", data.imagen);
    document.querySelector("#info a").setAttribute("href", data.link);

    if (currentLocation) {
        const distancia = haversineDistance(currentLocation, [data.lat, data.lon]);
        document.querySelector("#info span").textContent = distancia + "km";
    } else {
        document.querySelector("#info span").textContent = "-";
    }
}

// Función para agregar un elemento al listado
function addToList(data) {
    // Verifica si las coordenadas están definidas correctamente
    if (data.geometry && data.geometry.coordinates && data.geometry.coordinates.length >= 2) {
        let lat = data.geometry.coordinates[1]; // Latitud
        let lon = data.geometry.coordinates[0]; // Longitud

        // Crear elemento de listado
        let listItem = document.createElement("div");
        listItem.classList.add("item");
        listItem.innerHTML = `
            <h3>${data.properties.NOMBRE}</h3>
            <p>${data.properties.DIRECCION}</p>
        `;
        document.querySelector("#listado").appendChild(listItem);
    } else {
        console.log("Error: Coordenadas no definidas correctamente en los datos.");
    }
}

//Carga de datos
fetch("static/da_transporte_paradasTaxi-4326.json")
    .then((res) => res.json())
    .then((data) => {
        data.features.forEach(element => {
            console.log(element);
            addToMap(element);
        });
    })
    .catch((err) => {
        console.log("Error en el fetch");
        console.log(err);
    });

function haversineDistance(coords1, coords2) {
    function toRad(x) {
        return x * Math.PI / 180;
    }

    const lon1 = coords1[0];
    const lat1 = coords1[1];

    const lon2 = coords2[0];
    const lat2 = coords2[1];

    const R = 6371; // km

    const x1 = lat2 - lat1;
    const dLat = toRad(x1);
    const x2 = lon2 - lon1;
    const dLon = toRad(x2)
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;

    return Math.round(d); // km
}

//Inicializar el mapa
initMap();
