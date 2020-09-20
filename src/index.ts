import got, { Options } from 'got';

import { getIds, auth, baseUrl } from './util';
// change these to match your projects name, statusName (to search for issues in)
// and doneStatusId (id of status to which the issues will be assigned)
const projectName = 'TEST';
const statusName = 'Awaiting Prod Deploy';
const doneStatusId = '41';
const query = encodeURI(`project = ${projectName} AND status = "${statusName}"`);

const headers = {
    'Content-Type': 'application/json',
    Authorization: `Basic ${auth}`,
  }

const getIssues = async () => {
  const opts = { headers };
  try {
    const response = await got(`${baseUrl}/search?jql=${query}`, opts);
    const result = JSON.parse(response.body);
    return getIds(result);
  } catch (error) {
    throw new Error(`Error fetching issues ${error}`);
  }
};

const transitionToDone = (issues) => {
  if (!issues) return;
  const body = JSON.stringify({ transition: { id: doneStatusId } });
  const opts: Options = { headers, body, method: 'POST' };
  const promises = [];
  let error: string;

  issues.forEach(id => {
    const p = new Promise(() => got(`${baseUrl}/issue/${id}/transitions`, opts));
    promises.push(p);
  });

  try {
    Promise.all(promises);
  } catch (err) {
    error = `Error transitioning issues to Done: ${err}`;
  }
  // eslint-disable-next-line prefer-const
  const message = error ? `Failed to update ${issues}` : `${issues.length} issues moved to Done!`;
  console.log(message);
};

const transitionIssues = async () => {
  const issueIds = await getIssues();
  return issueIds ? transitionToDone(issueIds) : console.log('No issues to update');
};

transitionIssues();
