import { alert } from "./alert.js";

export function paginator() {
  // Elementos por página
  const elementsPerPage = 40;

  // Variable para guardar nuestro generador
  let iterador;

  // Variable para el total de páginas que tendrá el páginador
  let totalPages;

  // Variable para indicar a la Api el número de paginación a mostrar
  let currentPage = 1;

  // Selectores
  const form = document.querySelector("#form");
  const containerResult = document.querySelector("#result");
  const containerPagination = document.querySelector("#pagination");

  // Evento
  form.addEventListener("submit", validateForm);

  //Validar formulario
  function validateForm(e) {
    e.preventDefault();

    const search = document.querySelector("#search").value.trim();

    if (search === "") {
      alert("El campo de búsqueda está vacío", "error");
      return;
    }

    //Consumir API
    consumingAPIPixabay();
  }

  // Consumir API
  function consumingAPIPixabay() {
    //Input del form
    const search = document.querySelector("#search").value.trim();

    const key = "";
    const url = `https://pixabay.com/api/?key=${key}&q=${search}&image_type=photo&per_page=${elementsPerPage}&page=${currentPage}`;

    fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        // Calcular el número de páginas para la paginación
        totalPages = calculatePages(data.totalHits);
        // Mostrar las imagenes en el DOM
        showSearch(data.hits);
      })
      .catch((error) => console.log(error));
  }

  //Mostrar búsqueda
  function showSearch(images) {
    // limpiar HTML de búsqueda previas
    cleanHTML(containerResult);

    // Validar si se ha encontrado la búsqueda
    if (images.length === 0) {
      // Mostrar mensaje
      const notFound = document.createElement("div");
      notFound.innerHTML = `<i class="bi bi-emoji-frown"></i> Búsqueda no encontrada, pruebe con otra palabra`;
      notFound.classList.add("text-center", "col", "fw-bold", "fs-3");

      // Agregar al DOM
      containerResult.appendChild(notFound);
      return;
    }

    // Recorrer el areglo y mostrar las imágenes correspondientes a la búsqueda en el DOM
    images.forEach((image) => {
      // Object Destructuring
      const { downloads, previewURL, views, likes, pageURL } = image;

      // Crear HTML
      const container = document.createElement("div");
      container.classList.add("col-md-3", "mb-3");

      const card = document.createElement("div");
      card.classList.add("card", "border-dark");

      const img = document.createElement("img");
      img.src = previewURL;
      img.alt = "imagen";
      img.classList.add("card-img-top");

      const cardBody = document.createElement("div");
      cardBody.classList.add("card-body");

      const paragraphDownloads = document.createElement("p");
      const paragraphViews = document.createElement("p");
      const paragraphLikes = document.createElement("p");

      paragraphDownloads.classList.add("text-center");
      paragraphDownloads.innerHTML = `<i class="bi bi-download"></i> ${downloads}`;

      paragraphViews.classList.add("text-center");
      paragraphViews.innerHTML = `<i class="bi bi-eye-fill"></i> ${views}`;

      paragraphLikes.classList.add("text-center");
      paragraphLikes.innerHTML = `<i class="bi bi-heart"></i> ${likes}`;

      const btnLink = document.createElement("a");
      btnLink.href = pageURL;
      btnLink.target = "_blank";
      btnLink.rel = "noopener noreferrer";
      btnLink.classList.add("btn", "btn-primary", "w-100");
      btnLink.innerHTML = `<i class="bi bi-link-45deg"></i> Ver Imagen`;

      // Agregar al DOM
      card.appendChild(img);
      card.appendChild(cardBody);
      cardBody.appendChild(paragraphDownloads);
      cardBody.appendChild(paragraphViews);
      cardBody.appendChild(paragraphLikes);
      cardBody.appendChild(btnLink);
      container.appendChild(card);
      containerResult.appendChild(container);
    });

    cleanHTML(containerPagination);
    // Mostrar botones de la paginación
    showPaginator();
  }

  // Calcular páginas del paginador
  function calculatePages(totalPages) {
    return parseInt(Math.ceil(totalPages / elementsPerPage));
  }

  // Creamos un generador para la paginación
  function* createPaginator(total) {
    for (let i = 1; i <= total; i++) {
      yield i;
    }
  }

  /*Esta función genera los botones de paginación según el número
 total de páginas. Utiliza un generador para iterar a través del
 número de páginas y crea un botón de enlace para cada página.
 Agrega un evento de clic al enlace para que, cuando se haga clic,
 se actualice la página actual y se llame a la función consumingAPIPixabay.*/

  function showPaginator() {
    // Asignamos el generador a la variable iterador
    iterador = createPaginator(totalPages);

    while (true) {
      // Object destructuring
      const { done, value } = iterador.next();

      // Verificar si el generador ha llegado al último elemento del areglo.
      if (done) return;

      //   En caso contrario:

      // Crear HTML
      const btnLink = document.createElement("a");
      btnLink.innerHTML = `<i class="bi bi-chevron-double-right"></i> ${value}`;
      btnLink.href = "#";
      btnLink.dataset.page = value;
      btnLink.classList.add("btn", "btn-primary", "me-3", "mt-2");

      // Añadir evento
      btnLink.onclick = (e) => {
        e.preventDefault();
        /* Establecer la página actual al valor del botón pulsado y 
				luego llamar a la función función consumingAPIPixabay.*/
        currentPage = value;
        consumingAPIPixabay();
      };

      // Agregar al DOM
      containerPagination.appendChild(btnLink);
    }
  }

  // Limpiar HTML previo
  function cleanHTML(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
}
