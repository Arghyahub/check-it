const { cloudinary } = require('./utils/cloudinary');
const express = require('express');
const app = express();
var cors = require('cors');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

app.get('/api/images', async (req, res) => {
    const { resources } = await cloudinary.search
        .expression('folder:dev_setups')
        .sort_by('public_id', 'desc')
        .max_results(30)
        .execute();

    const publicIds = resources.map((file) => file.public_id);
    res.send(publicIds);
});
let imgurl = '';
app.post('/api/upload', async (req, res) => {
    try {
        const fileStr = req.body.data;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: 'ml_default',
        });
        imgurl = uploadResponse.secure_url;
        // console.log(imgurl);
        const options = {
            method: 'POST',
            url: 'https://cheque-india-ocr.p.rapidapi.com/v3/tasks/sync/extract/ind_cheque',
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': '5d8474fee9mshaa93b3ca6ddfd3ap13c54cjsndcfdd92b3429',
                'X-RapidAPI-Host': 'cheque-india-ocr.p.rapidapi.com'
            },
            data: `{"task_id":"74f4c926-250c-43ca-9c53-453e87ceacd1","group_id":"8e16424a-58fc-4ba4-ab20-5bc8e7c3c41e","data":{"document1":"${imgurl}"}}`
        };
        axios.request(options).then(function (response) {
            console.log("This is running") ;
            res.status(200).json(response.data.result.extraction_output);
        }).catch(function (error) {
            console.error(error);
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});
const axios = require("axios");




const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log('listening on http://localhost:3001/');
});
