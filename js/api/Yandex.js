/**
 * Класс Yandex
 * Используется для управления облаком.
 * Имеет свойство HOST
 * */
class Yandex {
    static HOST = 'https://cloud-api.yandex.net/v1/disk';

    /**
     * Метод формирования и сохранения токена для Yandex API
     */
    static getToken() {

        let yandexToken = localStorage.getItem('yandexToken');
        //console.log('yandexToken:', yandexToken);

        if (!yandexToken) {
            yandexToken = prompt('Введите OAUth-токен от Яндекс.Диска')
            localStorage.setItem('yandexToken', yandexToken)
        }
        ;
        return yandexToken;


    }

    /**
     * Метод загрузки файла в облако
     */
    static uploadFile(path, url, callback) {

        const token = this.getToken();

        const uploadUrl = `${this.HOST}/resources/upload?path=${encodeURIComponent(path + '.jpg')}&url=${encodeURIComponent(url)}`;

        createRequest({
            method: 'POST',
            url: uploadUrl,
            headers: {
                'Authorization': `OAuth ${token}`,
            },
            callback: callback,
        });

    }

    /**
     * Метод удаления файла из облака
     */
    static removeFile(path, callback) {

        const token = this.getToken();
        const removeUrl = `${this.HOST}/resources?path=${encodeURIComponent(path)}`;

        createRequest({
            method: 'DELETE',
            url: removeUrl,
            headers: {
                'Authorization': `OAuth ${token}`,
            },
            callback: callback,
        });


    }

    /**
     * Метод получения всех загруженных файлов в облаке
     */
    static getUploadedFiles(callback) {

        const token = this.getToken();
        const filesUrl = `${this.HOST}/resources/files?limit=100&media_type=image`;

        createRequest({
            method: 'GET',
            url: filesUrl,
            headers: {
                'Authorization': `OAuth ${token}`,
            },
            callback: callback,
        });

    }

    /**
     * Метод скачивания файлов
     */
    static downloadFileByUrl(url) {
        const link = document.createElement('a');
        link.href = url;
        link.click();
    }


}

Yandex.getToken();
