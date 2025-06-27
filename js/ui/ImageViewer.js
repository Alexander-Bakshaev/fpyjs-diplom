/**
 * Класс ImageViewer
 * Используется для взаимодействием блоком изображений
 * */
class ImageViewer {
    constructor(element) {
        this.element = element;
        this.photoPreview = this.element.querySelector('.image')
        this.blockImages = this.element.querySelector('.images-list .grid .row');
        //console.log('this.blockImages:', this.blockImages)
        //console.log('photoPreview:', this.photoPreview);

        this.registerEvents();
    }

    /**
     * Добавляет следующие обработчики событий:
     * 1. Клик по изображению меняет класс активности у изображения
     * 2. Двойной клик по изображению отображает изображаения в блоке предпросмотра
     * 3. Клик по кнопке выделения всех изображений проверяет у всех ли изображений есть класс активности?
     * Добавляет или удаляет класс активности у всех изображений
     * 4. Клик по кнопке "Посмотреть загруженные файлы" открывает всплывающее окно просмотра загруженных файлов
     * 5. Клик по кнопке "Отправить на диск" открывает всплывающее окно для загрузки файлов
     */
    registerEvents() {
        // Двойной клик по превьюшке фотографии
        this.blockImages.addEventListener('dblclick', (e) => {
            if (e.target.tagName.toLowerCase() === 'img') {
                this.photoPreview.src = e.target.src;
            }
        })

        // Одинарный клик по превьюшке фотографии
        this.blockImages.addEventListener('click', (e) => {
            if (e.target.tagName.toLowerCase() === 'img') {
                e.target.classList.toggle('selected');
                this.checkButtonText();

            }
        })

        // Клик по кнопке "Выбрать всё" / "Снять выделение"
        document.querySelector('.select-all').addEventListener('click', () => {
            const blockImages = document.querySelector('.images-list .grid .row');

            const allImages = Array.from(blockImages.getElementsByTagName('img'));
            //console.log('allImages:', allImages);


            const hasSelectedImages = allImages.some((image) => image.classList.contains('selected'));
            if (hasSelectedImages) {
                allImages.forEach((image) => {
                    image.classList.remove('selected')
                });
            } else {
                allImages.forEach((image) => {
                    image.classList.add('selected')
                });
            }
            this.checkButtonText();

        });

        //Клик по кнопке "Посмотреть загруженные файлы"
        this.element.querySelector('.show-uploaded-files').addEventListener('click', () => {
            const modal = App.getModal('filePreviewer'); //С помощью метода App.getModal получает модальное окно просмотра загруженных изображений.
            document.querySelector(".uploaded-previewer-modal .content").innerHTML = '<i class="asterisk loading icon massive"></i>';
            modal.open();  //Открывайте модальное окно с помощью метода open

            Yandex.getUploadedFiles((json) => {   //Получите все загруженные изображения с помощью метода Yandex.getUploadedFiles
                //После выполнения метода (в колбеке) отрисовывайте все полученные изображения с помощью метода showImages у объекта модального окна.
                modal.showImages(json);
            })
        })

        //Клик по кнопке "Отправить на диск"
        this.element.querySelector('.send').addEventListener('click', () => {
            const sendModal = App.getModal('fileUploader'); //С помощью метода App.getModal получает модальное окно загрузки изображений.
            const selectedImages = this.blockImages.getElementsByClassName('selected');
            sendModal.open();
            sendModal.showImages(selectedImages);

        })


    }

    /**
     * Очищает отрисованные изображения
     */
    clear() {
        const images = document.querySelectorAll('.image-wrapper'); //ищем изображения
        images.forEach((image) => {
            image.remove() //отключаем изображения
        })
    }

    /**
     * Отрисовывает изображения.
     */
    drawImages(images) {

        if (images.length > 0) {
            document.querySelector('.select-all').classList.remove('disabled');
        } else {
            document.querySelector('.select-all').classList.add('disabled');
        }

        images.forEach((image) => {
            //console.log('image:', image);

            const img = document.createElement('img');
            let elem = document.createElement('div');
            elem.classList.add('four', 'wide', 'column', 'ui', 'medium', 'image-wrapper');
            elem.innerHTML = `<img src="${image}" />`;

            //Вариант 2 вместо elem.innerHTML = `<img src="${image}" />`;
            //img.src = image;
            //elem.appendChild(img);

            document.querySelector('.images-list .grid .row').appendChild(elem)
        });


    }

    /**
     * Контроллирует кнопки выделения всех изображений и отправки изображений на диск
     */
    checkButtonText() {
        const allPhotos = this.blockImages.querySelectorAll('img');
        const selectAllBnt = document.querySelector(".select-all")
        const sendBtn = document.querySelector('.send');
        let countSelected = 0;
        for (let photo of allPhotos) {
            if (photo.classList.contains('selected')) {
                countSelected++;
            }
        }

        if (countSelected === allPhotos.length) {
            selectAllBnt.textContent = 'Снять выделение';
        } else {
            selectAllBnt.textContent = 'Выбрать всё';
        }

        if (countSelected > 0) {
            sendBtn.classList.remove('disabled');
        } else {
            sendBtn.classList.add('disabled');
        }

    }

}