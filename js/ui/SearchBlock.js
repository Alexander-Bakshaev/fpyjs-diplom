/**
 * Класс SearchBlock
 * Используется для взаимодействием со строкой ввода и поиска изображений
 * */
class SearchBlock {
    constructor(element) {
        this.element = element;
        /* this.replaceButton = element.querySelector('.replace');
        this.addButton = element.querySelector('.add');
        this.searchInput = element.querySelector('input'); */
        this.registerEvents();
    }

    /**
     * Выполняет подписку на кнопки "Заменить" и "Добавить"
     * Клик по кнопкам выполняет запрос на получение изображений и отрисовывает их,
     * только клик по кнопке "Заменить" перед отрисовкой очищает все отрисованные ранее изображения
     */
    registerEvents() {

        const replaceButton = this.element.querySelector('.replace');  //кнопка "заменить"
        const addButton = this.element.querySelector('.add');           // кнопка "добавить"
        const searchInput = this.element.querySelector('input');      //поле ввода ID

        replaceButton.addEventListener('click', () => {
            const userId = searchInput.value.trim();

            if (userId) {
                App.imageViewer.clear();
                VK.get(userId, App.imageViewer.drawImages);
            } else {
                alert('Введите VK id');
            }
        });

        addButton.addEventListener('click', () => {

            const userId = searchInput.value.trim();
            if (userId) {
                VK.get(userId, App.imageViewer.drawImages);
            } else {
                alert('Введите VK id');
            }
        });

        /* const handleButtonClick = (e) => {
          const userId = searchInput.value;
          if (!userId) return;

          VK.get(userId, (images) => {
            const imageViewer = App.imageViewer;
            if (this.replaceButton == e.target) {
              imageViewer.clear();
            }
            imageViewer.drawImages(images);
          });
        };

        replaceButton.addEventListener('click', handleButtonClick);
        addButton.addEventListener('click', handleButtonClick); */
    }
}

