/* eslint-disable @typescript-eslint/camelcase */

import { debug as log, getInput, setFailed } from '@actions/core';
import { context } from '@actions/github';

// Helper function to retrieve ticket number from a string (either a shorthand reference or a full URL)
const extractId = (value: string): string | null => {
  const result = value.match(/\d+/);

  if (result !== null) {
    return result[0];
  }

  return null;
};

const debug = (label: string, message: string): void => {
  log('');
  log(`[${label.toUpperCase()}]`);
  log(message);
  log('');
};

async function run(): Promise<void> {
  try {
    // Provide complete context object right away if debugging
    debug('context', JSON.stringify(context));

    const login = context.payload.pull_request?.user.login as string;
    const senderType = context.payload.pull_request?.user.type as string;
    const sender: string = senderType === 'Bot' ? login.replace('[bot]', '') : login;

    // Debugging Entries
    debug('sender', sender);
    debug('sender type', senderType);

    // Retrieve the pull request body and verify it's not empty
    const body = context?.payload?.pull_request?.body;

    if (body === undefined) {
      debug('failure', 'Body is undefined');
      setFailed('Could not retrieve the Pull Request body');
      return;
    }

    debug('body contents', body);

    // Check for a ticket reference number in the body
    const bodyRegexBase = getInput('bodyRegex', { required: true });
    const bodyRegexFlags = getInput('bodyRegexFlags', { required: true });
    const bodyRegex = new RegExp(bodyRegexBase, bodyRegexFlags);
    const bodyCheck = bodyRegex.exec(body);

    // Check for a ticket reference URL in the body
    const bodyURLRegexBase = getInput('bodyURLRegex', { required: false });

    if (!bodyURLRegexBase) {
      debug('warn', 'Body do not contain a reference to a ticket, and no body URL regex was set');
      // setFailed('No ticket was referenced in this pull request');
      // return;
    }

    const bodyURLRegexFlags = getInput('bodyURLRegexFlags', {
      required: true
    });
    const bodyURLRegex = new RegExp(bodyURLRegexBase, bodyURLRegexFlags);
    const bodyURLCheck = bodyURLRegex.exec(body);

    if (bodyURLCheck !== null) {
      debug('success', 'Body contains a ticket URL');
      const id = extractId(bodyURLCheck[0]);
      if (id === null) {
        debug('warn', 'Could not extract a ticket URL from the body');
        // setFailed('Could not extract a ticket URL from the body');
        // return;
      }
    }

    debug('bodyCheck', bodyCheck?.length ? bodyCheck.toString() : 'bodyCheck is null');

    if (bodyCheck === null && bodyURLCheck === null) {
      debug('failure', 'Title, branch, and body do not contain a reference to a ticket');
      setFailed('No ticket was referenced in this pull request');
      return;
    }
  } catch (error) {
    setFailed(error.message);
  }
}

run();
