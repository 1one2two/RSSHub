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

    const description = await $('.container-fluid')
        .map((index, item) => {
            const response_tiny = got({
                method: 'get',
                url: `https://www.ccu.edu.tw/` + $(item).find('.col-lg-9 a').first().attr('href'),
            });
            const data = cheerio.load(response_tiny.data);
            return data('.news_content').first().text().trim();
        })

    console.log(description[0]);

    ctx.state.data = {
        title: `中正大學`,
        link: baseUrl + type,
        description: `中正大學`,
        item: $('.container-fluid')
            .map((index, item) => ({
                title: $(item).find('.col-lg-9 a').first().text().trim(),
                description: description[index],
                pubDate: $(item).find('.col-lg-2').first().text().trim(),
                link: $(item).find('.col-lg-9 a').first().attr('href'), // + $(item).find('td')[1].attr('href'),
            }))
            .get(),
    };
};
