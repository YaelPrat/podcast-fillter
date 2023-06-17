"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var xml2js = require("xml2js");
var filterKeywords = ['Gil Rouvio', 'Eclectic'];
fs.readFile('./feed.podbean.com_kzradio_feed.xml', function (err, data) {
    if (err) {
        console.error('Failed to read input file:', err);
        return;
    }
    var xml = data.toString();
    xml2js.parseString(xml, function (err, result) {
        if (err) {
            console.error('Failed to parse XML:', err);
            return;
        }
        var channel = result.rss.channel[0];
        var items = channel.item;
        var filteredItems = items.filter(function (item) {
            var title = item.title[0];
            return filterKeywords.some(function (keyword) { return title.includes(keyword); });
        });
        channel.item = filteredItems;
        var builder = new xml2js.Builder();
        var filteredXml = builder.buildObject(result);
        fs.writeFile('./output.xml', filteredXml, function (err) {
            if (err) {
                console.error('Failed to write output file:', err);
                return;
            }
            console.log('Filtered XML saved to output.xml');
        });
    });
});
