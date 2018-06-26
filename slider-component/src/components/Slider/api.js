/* author: makarov */

export function getIamges(url) {
    return new Promise(resolve => resolve({
        data: {
            slides: [{
                text: "first slide",
                header: "first",
                url: "http://placekitten.com/400/200",
            }, {
                text: "second slide",
                header: "second",
                url: "http://placekitten.com/400/201",
            }, {
                text: "third slide",
                header: "third",
                url: "http://placekitten.com/400/202",
            }]
        }
    }));
}