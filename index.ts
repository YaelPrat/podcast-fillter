import * as fs from 'fs';
import * as xml2js from 'xml2js';

const filterKeywords = ['Gil Rouvio', 'Eclectic'];


fs.readFile('./feed.podbean.com_kzradio_feed.xml', (err, data) => {
  if (err) {
    console.error('Failed to read input file:', err);
    return;
  }

  const xml = data.toString();

  xml2js.parseString(xml, (err, result) => {
    if (err) {
      console.error('Failed to parse XML:', err);
      return;
    }

    const channel = result.rss.channel[0];
    const items = channel.item;

    const filteredItems = items.filter((item: any) => {
      const title = item.title[0];
      return filterKeywords.some(keyword => title.includes(keyword));
    });

    channel.item = filteredItems;

    const builder = new xml2js.Builder();
    const filteredXml = builder.buildObject(result);

    fs.writeFile('./output.xml', filteredXml, (err) => {
      if (err) {
        console.error('Failed to write output file:', err);
        return;
      }
      console.log('Filtered XML saved to output.xml');
    });
  });
});
