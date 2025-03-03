window.addEventListener('DOMContentLoaded', event => {
    getPublishDate();
});

const getPublishDate = () => {
    const header = document.querySelector('header');
    const publishDateParagraph = document.createElement('p');

    const file = window.location.pathname.split('/').pop();
    const publication = appData.publications.find(publication => publication.contentFile.includes(file));

    if (!publication) return;
    const publishDate = new Date(publication.publicationDate);
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    publishDateParagraph.textContent = `Publicado el ${publishDate.getDate()} de ${months[publishDate.getMonth()]} de ${publishDate.getFullYear()}`;
    header.appendChild(publishDateParagraph);
};

const goBack = () => {
    const previousUrl = window.location.href;
    window.history.back();

    console.log(previousUrl);

    setTimeout(() => {
        const actualUrl = window.location.href;
        if (previousUrl === actualUrl) {
            window.location.href = '/';
        }
    }, 500);
};