const express = require('express');
const router = express.Router();
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
);

router.get('/oauth2callback', async (req, res) => {
    const { code } = req.query;

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Now you can use the Fitness API
    const fitness = google.fitness({ version: 'v1', auth: oauth2Client });

    const response = await fitness.users.dataSources.datasets.get({
        userId: 'me',
        dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps',
        datasetId: 'today'
    });

    res.json(response.data);
});

module.exports = router;
