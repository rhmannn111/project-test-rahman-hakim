$(document).ready(function () {
  const header = $('#main-header');
  const postsList = $('#posts-list');
  const showingCount = $('#showing-count');
  const totalCount = $('#total-count');
  const showPerPage = $('#show-per-page');
  const sortOrder = $('#sort-order');
  const prevPageButton = $('#prev-page');
  const nextPageButton = $('#next-page');

  let currentPage = 1;
  let totalPages = 0;
  let perPage = 10;
  let sort = '-published_at';
  let lastScrollTop = 0;
  $(window).on('scroll', function () {
    let scrollTop = $(this).scrollTop();
    if (scrollTop > lastScrollTop) {
      header.css('top', '-100px');
    } else {
      header.css('top', '0');
    }
    lastScrollTop = scrollTop;
  });
  function fetchPosts() {
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    const apiUrl = `${proxyUrl}https://suitmedia-backend.suitdev.com/api/ideas?page[number]=${currentPage}&page[size]=${perPage}&append[]=small_image&append[]=medium_image&sort=${sort}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched Data:', data);

        renderPosts(data.data);
        totalCount.text(data.meta.total);
        totalPages = Math.ceil(data.meta.total / perPage);

        const startItem = (currentPage - 1) * perPage + 1;
        const endItem = Math.min(currentPage * perPage, data.meta.total);
        showingCount.text(`${startItem} - ${endItem}`);

        prevPageButton.prop('disabled', currentPage === 1);
        nextPageButton.prop('disabled', currentPage === totalPages);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }

  function renderPosts(posts) {
    postsList.empty();

    posts.forEach((post) => {
      
      console.log('Rendering Post:', post);

      const postCard = `
              <div class="col-md-4">
                  <div class="card post-card mb-4">
                      <img src="${post.small_image}" class="card-img-top" alt="${post.title}">
                      <div class="card-body">
                          <h5 class="card-title">${post.title}</h5>
                          <p class="card-text">${post.summary}</p>
                      </div>
                  </div>
              </div>
          `;
      postsList.append(postCard);
    });
  }

  // Event listeners
  showPerPage.on('change', function () {
    perPage = parseInt(this.value);
    currentPage = 1;
    fetchPosts();
  });

  sortOrder.on('change', function () {
    sort = this.value;
    currentPage = 1;
    fetchPosts();
  });

  prevPageButton.on('click', function () {
    if (currentPage > 1) {
      currentPage--;
      fetchPosts();
    }
  });

  nextPageButton.on('click', function () {
    if (currentPage < totalPages) {
      currentPage++;
      fetchPosts();
    }
  });
  fetchPosts();
});
