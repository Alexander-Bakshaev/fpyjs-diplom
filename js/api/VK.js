/**
 * Класс VK
 * Управляет изображениями из VK. С помощью VK API.
 * С помощью этого класса будет выполняться загрузка изображений из vk.
 * Имеет свойства ACCESS_TOKEN и lastCallback
 *
 * */

// ID: 52683454

//   ID: 52683463

//https://vk.com/app52683454

class VK {

    static ACCESS_TOKEN = prompt('Введите VK-токен');

    // course_paper ID: 51583845

    static lastCallback;

    /**
     * Получает изображения
     * */
    static get(id = '', callback) {
        VK.lastCallback = callback;
        const script = document.createElement('script');
        script.id = 'vk__response'
        script.src = `https://api.vk.com/method/photos.get?owner_id=${id}&album_id=profile&access_token=${VK.ACCESS_TOKEN}&v=5.131&callback=VK.processData`;
        document.getElementsByTagName("body")[0].appendChild(script);
        /* window.vkCallback = (result) => {
          VK.processData(result);
        }; */

    }

    /**
     * Передаётся в запрос VK API для обработки ответа.
     * Является обработчиком ответа от сервера.
     */
    static processData(result) {
        if (!result || !result.response || !result.response.items) {
            alert('Ошибка при получении данных!');
            return;
        }
        ;
        document.getElementById('vk__response').remove();

        //console.log("result.response.items:", result.response.items);
        const images = [];

        for (const item of result.response.items) {
            let sizes = item.sizes;
            let maxSize = sizes.reduce((prev, current) => {
                const prevArea = prev.width * prev.height;
                const currentArea = current.width * current.height;
                return prevArea > currentArea ? prev : current;
            });
            images.push(maxSize.url);
        }
        VK.lastCallback(images);
        VK.lastCallback = () => {
        };

        //console.log('images:', images);


    }
}
