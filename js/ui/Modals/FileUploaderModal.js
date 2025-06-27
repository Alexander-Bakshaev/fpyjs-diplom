/**
 * Класс FileUploaderModal
 * Используется как всплывающее окно для загрузки изображений
 */
class FileUploaderModal extends BaseModal {
    constructor(element) {
        super(element);
        this.imageContainers = element[0];
        this.registerEvents()

    }

    /**
     * Добавляет следующие обработчики событий:
     * 1. Клик по крестику на всплывающем окне, закрывает его
     * 2. Клик по кнопке "Закрыть" на всплывающем окне, закрывает его
     * 3. Клик по кнопке "Отправить все файлы" на всплывающем окне, вызывает метод sendAllImages
     * 4. Клик по кнопке загрузке по контроллерам изображения:
     * убирает ошибку, если клик был по полю вода
     * отправляет одно изображение, если клик был по кнопке отправки
     */
    registerEvents() {
        const xBtn = this.domElement.querySelector('.x.icon');
        xBtn.addEventListener('click', () => {
            this.close()
        })

        const closeButton = this.domElement.querySelector('.ui.close.button');
        closeButton.addEventListener('click', () => {
            this.close()
        })

        const sendAllFilesButton = this.domElement.querySelector('.ui.send-all.button');
        sendAllFilesButton.addEventListener('click', () => {
            this.sendAllImages()
        });

        const contentBlock = this.domElement.querySelector('.content');
        contentBlock.addEventListener('click', (e) => {
            const target = e.target;
            const imageContainer = target.closest('.image-preview-container');
            if (target.tagName.toLowerCase() === 'input') {
                target.classList.remove("error");
            }

            if (target.classList.contains('.button')) {
                this.sendImage(imageContainer)
            }

        })
    }

    /**
     * Отображает все полученные изображения в теле всплывающего окна
     */
    showImages(images) {

        /* const imagesList = Array.from(images).reverse();
        imagesList.map((image) => getImageHTML(image)).join('');
        this.domElement.querySelector('.content').innerHTML = imagesList */
        ;

        const imagesHTML = Array.from(images)
            .reverse()
            .map((image) => this.getImageHTML(image))
            .join('');

        this.domElement.querySelector('.content').innerHTML = imagesHTML;

    }

    /**
     * Формирует HTML разметку с изображением, полем ввода для имени файла и кнопкной загрузки
     */
    getImageHTML(item) {

        return `<div class="image-preview-container">
                  <img src='${item.src}' />
                  <div class="ui action input">
                    <input type="text" placeholder="Путь к файлу">
                    <button class="ui button"><i class="upload icon"></i></button>
                  </div>
                </div>`;


    }

    /**
     * Отправляет все изображения в облако
     */
    sendAllImages() {
        this.imageContainers.querySelectorAll('.image-preview-container').forEach((container) => {
            this.sendImage(container);
        })
    }

    /**
     * Валидирует изображение и отправляет его на сервер
     */
    sendImage(imageContainer) {


        const inputField = imageContainer.querySelector('input');
        //console.log('inputField :', inputField);

        const imagePath = inputField.value.trim()

        if (imagePath == '') {
            imageContainer.classList.add('error');
            return;
        }

        inputField.disabled = true;

        const imageElement = imageContainer.querySelector('img');
        const imageUrl = imageElement.src;

        Yandex.uploadFile(imagePath, imageUrl, () => {
            imageContainer.remove();
            const remainingImages = this.domElement.querySelectorAll('.image-preview-container');

            if (remainingImages.length == 0) {
                this.close()
            }
        });


    }
}