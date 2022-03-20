const got = require('@/utils/got');
const cheerio = require('cheerio');

const baseUrl = 'https://www.ccu.edu.tw/bullentin_list.php?id=';

module.exports = async (ctx) => {
    let type = ctx.params && ctx.params.type;
    if (type === undefined) {
        type = '0';
    }

    const response = await got({
        method: 'get',
        url: baseUrl + type,
    });

    const $ = cheerio.load(response.data);
    const list = $("div[class='container-fluid mt-3 point_baseline']")
        .map((index, item) => ({
            title: $(item).find('.col-lg-9 a').first().text().trim(),
            description: '',
            pubDate: $(item).find('.col-lg-2').first().text().trim(),
            link: `https://www.ccu.edu.tw` + $(item).find('.col-lg-9 a').first().attr('href'), // + $(item).find('td')[1].attr('href'),
            more: '123',
        }))
        .get();

    const out = await Promise.all(
        list.map((item) =>
            ctx.cache.tryGet(item.link, async () => {
                const itemRes = await got({
                    method: 'get',
                    url: item.link,
                });

                const $ = cheerio.load(itemRes.data);

                let image = '';
                $("div[class='carousel-inner']")
                    .find('img')
                    .each((_, item) => {
                        image += `<img src='https://www.ccu.edu.tw${item.attribs.src}'>`;
                    });

                let more = '';
                $("div[style='color: #595757']")
                    .find('div')
                    .each((_, item) => {
                        more += item.childNodes[0].data + '<br>';
                    });

                return {
                    title: item.title,
                    description: image + $('.news_content').first().text().trim() + '<br>' + more,
                    pubDate: item.pubDate,
                    link: item.link,
                };
            })
        )
    );

    ctx.state.data = {
        title: `中正大學`,
        link: baseUrl + type,
        description: `中正大學`,
        item: out,
    };
};
