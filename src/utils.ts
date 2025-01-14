import * as AWS from 'aws-sdk';
import { parse } from 'json2csv';

const s3 = new AWS.S3();

export function generateCsv(data: any[]): string {
    const fields = Object.keys(data[0]);
    return parse(data, { fields });
}

export async function uploadToS3(bucket: string, key: string, body: string): Promise<void> {
    await s3
        .putObject({
            Bucket: bucket,
            Key: key,
            Body: body,
            ContentType: 'text/csv',
        })
        .promise();
}
