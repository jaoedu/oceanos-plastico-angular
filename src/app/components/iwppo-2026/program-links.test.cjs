const { test } = require('node:test');
const assert = require('node:assert/strict');

const sessions = [
  ['2026-11-18', 0, '2202963704521878', 'yVXnTjTLLqZIYcVKUE'],
  ['2026-11-18', 1, '2671054252794857', 'ysjZpBSXoAB2jW66j1'],
  ['2026-11-18', 2, '2202974642330476', 'Gv8TYtuFlgqgXRdwFm'],
  ['2026-11-18', 4, '2887306751208644', 'K7ZEkI9qybv4MvnYcC'],
  ['2026-11-18', 5, '2945277422254633', '6FaiVDuxqLglBnGwYT'],
  ['2026-11-18', 6, '2227024992883618', 'bFBpISpQWlCDMAjunx'],
  ['2026-11-19', 0, '2852038887480504', 'f4bsu6Nj1NkioLEhMC'],
  ['2026-11-19', 1, '2800676435830268', 'lgpAwTtqL5eoS8kCql'],
  ['2026-11-19', 2, '2679678682515561', '0fiHps9M4WuIsxShHt'],
  ['2026-11-19', 3, '2412232299686263', 'qoa5lWiym6LA6KklBP'],
  ['2026-11-19', 4, '2513201057699233', 'RWwHJUPTpvIPirYzZd'],
];

for (const language of ['pt', 'en', 'es']) {
  test(`all PDF meeting links belong to the correct sessions in ${language}`, () => {
    const { schedule, ui } = require(`../../../assets/data/iwppo-2026/${language}.json`);
    assert.equal(schedule.flatMap(day => day.activities).filter(activity => activity.meetingUrl).length, 11);
    for (const [date, index, id, passcode] of sessions) {
      const activity = schedule.find(day => day.date === date).activities[index];
      assert.equal(activity.meetingUrl, `https://teams.microsoft.com/meet/${id}?p=${passcode}`);
      const url = new URL(activity.meetingUrl);
      assert.equal(url.origin, 'https://teams.microsoft.com');
      assert.equal(url.searchParams.size, 1);
    }
    const thematicRooms = schedule.find(day => day.date === '2026-11-18').activities.slice(0, 2);
    assert.ok(thematicRooms[0].room.includes('Restinga'));
    assert.ok(thematicRooms[1].room.includes('Ajuri'));
    for (const label of ['title', 'description', 'join', 'newTab', 'timezone']) {
      assert.ok(ui.onlineAccess[label]?.trim(), `${label} must be translated`);
    }
  });
}
