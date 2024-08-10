$(document).ready(function () {
  let lastScrollTop = 0;

  
  function handleNavbarDisplay() {
    const currentScrollTop = $(window).scrollTop();

    if (currentScrollTop > lastScrollTop) {

      $('#main-header').slideUp('fast');
    } else {

      $('#main-header').slideDown('fast');
    }

    lastScrollTop = currentScrollTop;
  }

  $(window).on('scroll', handleNavbarDisplay);
  function loadPosts(page = 1, perPage = 10, sortOrder = '-published_at') {
    const totalPosts = 100; // Assume we have 100 posts
    const posts = generateSamplePosts(totalPosts);
    
    posts.sort((a, b) => {
      if (sortOrder === '-published_at') {
        return new Date(b.published_at) - new Date(a.published_at);
      } else {
        return new Date(a.published_at) - new Date(b.published_at);
      }
    });
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedPosts = posts.slice(startIndex, endIndex);

    $('#posts-list').empty();
    paginatedPosts.forEach((post) => {
      $('#posts-list').append(`
             <div class="col-md-3 col-sm-6 mb-3">
                 <div class="card">
                     <img src="${post.image}" class="card-img-top" alt="...">
                     <div class="card-body">
                         <h5 class="card-title">${post.title}</h5>
                         <p class="card-text">${post.content}</p>
                     </div>
                 </div>
             </div>
         `);
    });

    
    $('#showing-count').text(`${startIndex + 1} - ${Math.min(endIndex, totalPosts)}`);
    $('#total-count').text(totalPosts);

    
    $('#prev-page').prop('disabled', page === 1);
    $('#next-page').prop('disabled', endIndex >= totalPosts);
  }

  function generateSamplePosts(count) {
    const posts = [];
    const images = ['./img/gambar1.jpeg', './img/gambar2.jpeg', './img/gambar3.jpeg'];
    for (let i = 0; i < count; i++) {
      posts.push({
        title: `Post ${i + 1}`,
        content: `This is the content of post ${i + 1}.`,
        image: images[i % images.length],
        published_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
    }
    return posts;
  }

  loadPosts();

  $('#show-per-page').change(function () {
    const perPage = parseInt($(this).val());
    loadPosts(1, perPage, $('#sort-order').val());
  });

  $('#sort-order').change(function () {
    const sortOrder = $(this).val();
    loadPosts(1, parseInt($('#show-per-page').val()), sortOrder);
  });

  $('#prev-page').click(function () {
    const perPage = parseInt($('#show-per-page').val());
    const sortOrder = $('#sort-order').val();
    const currentPage = Math.ceil(parseInt($('#showing-count').text().split(' ')[0]) / perPage);
    loadPosts(currentPage - 1, perPage, sortOrder);
  });

  $('#next-page').click(function () {
    const perPage = parseInt($('#show-per-page').val());
    const sortOrder = $('#sort-order').val();
    const currentPage = Math.ceil(parseInt($('#showing-count').text().split(' ')[2]) / perPage);
    loadPosts(currentPage + 1, perPage, sortOrder);
  });
});
