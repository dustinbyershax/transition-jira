import 'dotenv/config';

const { API_TOKEN, EMAIL, ORGANIZATION } = process.env;

export const baseUrl = `https://${ORGANIZATION}.atlassian.net/rest/api/3`;

export const auth: string = Buffer.from(`${EMAIL}:${API_TOKEN}`, 'utf8').toString('base64');

export const getIds = ({ issues }): any[string] => issues.length && issues.map(({ id }) => id);