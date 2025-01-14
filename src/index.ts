import { APIGatewayProxyHandler } from 'aws-lambda';
import { queryDatabase } from './db';
import { generateCsv, uploadToS3 } from './utils';

export const handler: APIGatewayProxyHandler = async (event) => {
    try {
        const { templateId, dealershipId, startDate, endDate } = event.queryStringParameters || {};

        if (!templateId || !dealershipId || !startDate || !endDate) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing required query parameters' }),
            };
        }

        console.log(event.queryStringParameters);

        // Execute database query
        const data = await queryDatabase(templateId, dealershipId, startDate, endDate);

        // Generate CSV
        const csvData = generateCsv(data);

        // Upload CSV to S3
        const s3Key = `reports/${templateId}/${dealershipId}/${startDate}_${endDate}.csv`;
        const s3Bucket = process.env.S3_BUCKET!;
        await uploadToS3(s3Bucket, s3Key, csvData);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Report generated successfully',
                s3Path: `s3://${s3Bucket}/${s3Key}`,
            }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error', error: JSON.stringify(error) }),
        };
    }
};
