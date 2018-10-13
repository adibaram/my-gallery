console.log('Starting up');


function init() {
    renderProjects(gProjs);
}


function renderModal(projId) {
console.log(projId);
var currProj = getProjById(projId);
var temp = `
<h2>${currProj.title}</h2>
<p class="item-intro text-muted">Lorem ipsum dolor sit amet consectetur.</p>
<img class="img-fluid d-block mx-auto" src="${currProj.url}" alt="">
<p>${currProj.desc}</p>
<ul class="list-inline">
  <li>Date: ${currProj.publishedAt}</li>
  <li>Client: Window</li>
  <li>Category: ${currProj.labels}</li>
</ul>
<button class="btn btn-primary" data-dismiss="modal" type="button">
    <i class="fa fa-times"></i>
    Close Project</button>
`

var elModal = document.querySelector('.modal-body');
elModal.innerHTML = temp; 
}


function onSendEmail() {

        var subject =  document.getElementById('subject').value;
        if (subject === null || subject === "") {
            return false;
        }
        var message =  document.getElementById('message').value;
        if (message === null || message === "") {
            return false;
        }
    
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=adididi@gmail.com&su=${subject}&b
    ody=${message}`);
}








