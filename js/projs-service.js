console.log('Starting up');

var gProjs = [
    {
        "id": "books-store",
        "name": "e-Books store ",
        "title": "e-Books store",
        "desc": "My books store",
        "url": "img/my-portfolio/books.gif",
        "publishedAt": 'Oct 2018',
        "labels": ["e-coomerce ", "shop"],
        "link": "my-projects/books-store/index.html"
    },

    {
        "id": "guess-who",
        "name": "Guess Who",
        "title": "Guess Who",
        "desc": "Home made guess who Akinator",
        "url": "img/my-portfolio/guess-who.gif",
        "publishedAt": 'Oct 2018',
        "labels": ["localStorage"],
        "link": "my-projects/guess-who/index.html"
    },

    {
        "id": "todo",
        "name": "todo",
        "title": "To-Do",
        "desc": "Create your own Todo list",
        "url": "img/my-portfolio/todo-list.gif",
        "publishedAt": 'Oct 2018',
        "labels": ["MVC"],
        "link": "my-projects/todo/index.html"
    },

    {
        "id": "mine-sweeper",
        "name": "Mine Sweeper",
        "title": "Mine Sweeper",
        "desc": "Find all mines",
        "url": "img/my-portfolio/mine-sweeper.gif",
        "publishedAt": 'Sep 2018',
        "labels": ["JavaScript ", "board game"],
        "link": "my-projects/mine-sweeper/index.html"
    },

    {
        "id": "collect-balls",
        "name": "Ball Board",
        "title": "Ball Board",
        "desc": "Collect the balls in the board",
        "url": "img/my-portfolio/collect-balls.gif",
        "publishedAt": 'Sep 2018',
        "labels": ["keyboard events ", "speed"],
        "link": "my-projects/collect-balls/index.html"
    },

    {
        "id": "balloon-pop",
        "name": "Balloon Pop",
        "title": "Balloon Pop",
        "desc": "Pop the ballons in the picture",
        "url": "img/my-portfolio/balloons-pop.gif",
        "publishedAt": 'Sep 2018',
        "labels": ["mouse events ", "css"],
        "link": "my-projects/balloon-pop/index.html"
    },
];

function getProjById(projId) {
    return gProjs.find(function (proj) {
        return proj.id === projId;
    })
}

function deleteProj(projId) {
    var projIdx = gProjs.findIndex(function (proj) {
        return proj.id === projId;
    })
    gProjss.splice(projIdx, 1)

}

function renderProjects(projects) {
    console.log('projects', projects);


    var HTMLStrs = projects.map(function (proj) {
        console.log({ proj });

        return `
                    <div class="col-md-4 col-sm-6 portfolio-item">
                        <a class="portfolio-link" data-toggle="modal" href="#portfolioModal" onclick="renderModal('${proj.id}')">
                        <div class="portfolio-hover">
                            <div class="portfolio-hover-content">
                                <i class="fa fa-plus fa-3x"></i>
                            </div>
                        </div>
                        <img class="img-fluid" src="${proj.url}" > </a>
                        <div class="portfolio-caption">
                            <h4>${proj.title}</h4>
                            <p class="text-muted">${proj.desc}</p>
                        </div>
                    </div>
                    `
    });
    $('#proj-container').html(HTMLStrs.join(''));
}

