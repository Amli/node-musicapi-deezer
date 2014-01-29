var request = require('request'),
    baseurl = "https://api.deezer.com",
    iconurl = "https://cdns-files.deezer.com/images/common/favicon.png",
    type_mapping = {
        artist: "artist",
        album: "album",
        track: "track"
    };



function parse(type, object) {
    if (type === "album") {
        return {
            title: object.title,
            id: object.id,
            href: object.link,
            release_date: object.release_date,
            cover: object.cover + "?size=medium"
        };
    }
    if (type === "artist") {
        return {
            name: object.name,
            id: object.id,
            href: object.link,
            icon: object.picture
        };
    }
    if (type === "track") {
        return {
            title: object.title,
            id: object.id,
            href: object.link,
            release_date: object.release_date
        };
    }
}

var Deezer = function Deezer() {

};

Deezer.prototype.getServiceIconUrl = function deezer_getServiceIconUrl() {
    return iconurl;
};

Deezer.prototype.search = function deezer_search(type, query, callback) {
    request(
        {
            url: baseurl + "/search/" + type_mapping[type],
            qs: {
                q: query
            }
        },
        function(error, response, body) {
            var answer = JSON.parse(body),
                results = answer.data.map(function(item, key, list) {
                    return parse(type, item);
                });
            callback(results, query);
        }
    );
};

Deezer.prototype.get = function deezer_get(type, id, callback) {
    request.get(
        {
            url: baseurl + "/" + type_mapping[type] + "/" + id
        },
        function(error, response, body) {
            var answer = JSON.parse(body),
                result = parse(type, answer);

            callback(result, id);
        }
    );
}

Deezer.prototype.getArtistAlbums = function(artistid, callback) {
    console.log(baseurl + "/artist/" + artistid + "/albums");
    request(baseurl + "/artist/" + artistid + "/albums", function(error, response, body) {
        var answer = JSON.parse(body),
            availableAlbums = answer.data.map(function(item) {
                return parse("album", item);
            });
        console.log(body);
        callback(availableAlbums, artistid);
    });
};

module.exports = Deezer;