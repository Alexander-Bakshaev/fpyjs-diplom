/**
 * Класс PreviewModal
 * Используется как обозреватель загруженный файлов в облако
 */
class PreviewModal extends BaseModal {
    constructor(element) {
        super(element)
        this.registerEvents();
    }

    /**
     * Добавляет следующие обработчики событий:
     * 1. Клик по крестику на всплывающем окне, закрывает его
     * 2. Клик по контроллерам изображения:
     * Отправляет запрос на удаление изображения, если клик был на кнопке delete
     * Скачивает изображение, если клик был на кнопке download
     */
    registerEvents() {
        // Обработчик кнопки закрытия окна
        const buttonCloseModal = this.domElement.querySelector('.x.icon');
        buttonCloseModal.addEventListener('click', () => {
            this.close();
        })

        // Обработчик кнопок удаления фотографии и скачивания фотографии
        const content = this.domElement.querySelector('.content');
        console.log('content: ', content);
        console.log('imagesAll: ', content.childNodes.length);

        content.addEventListener('click', (event) => {
            const target = event.target;

            if (target.classList.contains('delete')) {
                const icon = target.querySelector('i');
                icon.classList.add('icon', 'spinner', 'loading');
                target.classList.add('disabled');

                const path = target.dataset.path;
                Yandex.removeFile(target.dataset.path, (response) => {
                    if (response === null) {
                        target.closest(".image-preview-container").remove();
                    }
                });
            }

            if (target.classList.contains('download')) {
                const url = target.dataset.file;
                Yandex.downloadFileByUrl(url);
            }

        })

    }


    /**
     * Отрисовывает изображения в блоке всплывающего окна
     */
    showImages(data) {

        if (!data) {
            this.domElement.querySelector('.content').innerHTML = '';
        }
        const reversedImages = data.items.reverse();
        const containers = reversedImages.map((image) => {
            const imageInfo = this.getImageInfo(image);

            return `<div class="image-preview-container">${imageInfo}</div>`;
        });
        this.domElement.querySelector('.content').innerHTML = containers.join('');

    }

    /**
     * Форматирует дату в формате 2021-12-30T20:40:02+00:00(строка)
     * в формат «30 декабря 2021 г. в 23:40» (учитывая временной пояс)
     * */
    formatDate(date) {
        const dataObj = new Date(date);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        };
        return dataObj.toLocaleDateString('ru-RU', options)
    }

    /**
     * Возвращает разметку из изображения, таблицы с описанием данных изображения и кнопок контроллеров
     * (удаления и скачивания)
     */
    getImageInfo(item) {
        //console.log('item:', item);
        const name = item.name;
        const preview = item.sizes[0].url; // "выдергиваем" из item фотографию для показа ее в превьюхе
        //console.log('sizes:', sizes);

        const path = item.path;
        const file = item.file;
        const created = this.formatDate(item.created);
        const size = Math.round(item.size / 1024);


        return `
      <img src="${preview}" />
      <table class="ui celled table">
        <thead>
          <tr><th>Имя</th><th>Создано</th><th>Размер</th></tr>
        </thead>
        <tbody>
          <tr><td>${name}</td><td>${created}</td><td>${size} Кб</td></tr>
        </tbody>
      </table>
      <div class="buttons-wrapper">
        <button class="ui labeled icon red basic button delete" data-path="${path}">
          Удалить
          <i class="trash icon"></i>
        </button>
        <button class="ui labeled icon violet basic button download" data-file="${file}">
          Скачать
          <i class="download icon"></i>
        </button>
      </div>
    `;


    }
}
