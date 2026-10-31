export async function setupJourney(page, serviceName = 'Aadhaar Address Update') {
  await page.goto('http://localhost:3000/discover');
  await page.getByText(serviceName).click();
  // Wait for the journey wrapper to load
  await page.waitForSelector('[data-testid^="stage-"]');
}

export async function advanceStage(page) {
  const nextBtn = page.getByTestId('primary-next-action');
  await nextBtn.click();
}

export function attachConsoleListeners(page, errorsArray, failedRequestsArray) {
  page.on('console', msg => {
    if (msg.type() === 'error') errorsArray.push(msg.text());
  });
  page.on('requestfailed', request => {
    failedRequestsArray.push(`${request.url()} - ${request.failure()?.errorText}`);
  });
}

export const VIEWPORTS = {
  mobile320: { width: 320, height: 800 },
  mobile360: { width: 360, height: 800 },
  mobile390: { width: 390, height: 844 },
  mobile414: { width: 414, height: 896 },
  desktop1366: { width: 1366, height: 768 },
  desktop1920: { width: 1920, height: 1080 }
};

export const SERVICES = [
  'Aadhaar Address Update',
  'Passport Application',
  'Voter ID Registration',
  'DigiLocker',
  'New PAN Card',
  'Driving Licence',
  'UAN Activation',
  'Ayushman Bharat Card',
  'PM YASASVI Scholarship',
  'PM-USP Scholarship',
  'NMMS Scholarship'
];
