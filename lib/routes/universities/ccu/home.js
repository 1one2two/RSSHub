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

    const description_data = [];
    // const descriptions = $('div[class="container-fluid mt-3 point_baseline"]');
    const descriptions = $('.container-fluid');
    for (const description_index in descriptions) {
        if (typeof (descriptions[description_index]) === 'number') {continue;}
        // console.log("-----------------------------------");
        if (descriptions[description_index][0] !== undefined) {continue;}
        const description_url = cheerio.load(descriptions[description_index]);
        // console.log(description_url('.col-lg-9 a').first().attr('href'));
        if (description_url('.col-lg-9 a').first().attr('href') === undefined) {continue;}
        // console.log(description_index);
        const response_tiny = await got({
            method: 'get',
            url: `https://www.ccu.edu.tw/` + description_url('.col-lg-9 a').first().attr('href'),
        });
        // console.log(response_tiny.data);
        const data = cheerio.load(response_tiny.data);
        // console.log(data('.news_content').first().text().trim());
        description_data[description_index] = data('.news_content').first().text().trim();
    }

    const $2 = cheerio.load(response.data);
    ctx.state.data = {
        title: `中正大學`,
        link: baseUrl + type,
        description: `中正大學`,
        item: $2('.container-fluid')
            .map((index, item) => ({
                title: $2(item).find('.col-lg-9 a').first().text().trim(),
                description: description_data[index],
                pubDate: $2(item).find('.col-lg-2').first().text().trim(),
                link: $2(item).find('.col-lg-9 a').first().attr('href'), // + $(item).find('td')[1].attr('href'),
            }))
            .get(),
    };
};
