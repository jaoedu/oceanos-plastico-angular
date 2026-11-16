const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

for (const language of ['pt', 'en', 'es']) {
  test(`withdrawn speakers are absent from the program in ${language}`, () => {
    const data = JSON.parse(fs.readFileSync(path.resolve(__dirname,
      `../../../assets/data/iwppo-2026/${language}.json`), 'utf8'));
    const program = JSON.stringify({ speakers: data.speakers, schedule: data.schedule });
    for (const name of ['Feni Dalano', 'Alexandre Urban', 'Carlos Alberto Cioce Sampaio',
      'Marcos Paulo', 'Robson Guimarães', 'Brendan P. Kelaher', 'Fernando Miguel',
      'Richard James Ladle', 'Alireza Moghayedi']) {
      assert.ok(!program.includes(name), `${name} must be absent`);
    }
    assert.ok(data.speakers.length > 0);
    for (const name of ['Alireza Moghayedi', 'Richard James Ladle']) {
      assert.ok(!data.scientificCommittee.some(member => member.name === name),
        `${name} must be absent from the scientific committee`);
    }
    assert.equal(data.schedule.length, 4);
  });

  test(`the official sessions and start times are shown in ${language}`, () => {
    const { schedule } = require(`../../../assets/data/iwppo-2026/${language}.json`);
    assert.deepEqual(schedule.slice(0, 3).map(day => day.activities.map(activity =>
      /^\d{2}:\d{2}$/.test(activity.time) ? activity.time : null)), [
      ['09:00', '14:30', '15:00', '15:45', '16:45', null],
      ['09:30', '09:30', '11:00', '12:00', '14:00', '15:00', '16:00'],
      ['09:30', '11:00', '13:00', '14:30', '16:00', '17:00'],
    ]);
    assert.ok(schedule[1].activities[1].speakers.includes('João Vitor Campos e Silva'));
    assert.equal(schedule[0].activities[2].moderator.name, 'Kátia Viana Cavalcante');
    assert.equal(schedule[1].activities[6].moderator.name, 'Santiago Linório Ferreyra Ramos');
    const centralAuditorium = { pt: 'Auditório Central', en: 'Central Auditorium', es: 'Auditorio Central' };
    assert.ok(schedule[2].activities.every(activity => activity.room === centralAuditorium[language]));
  });

  test(`shared profiles show their IWPPO 2025 Lattes links in ${language}`, () => {
    const data = require(`../../../assets/data/iwppo-2026/${language}.json`);
    for (const [people, name, id] of [
      [data.organizingCommittee, 'Victoria Camille', '0462311949230820'],
      [data.organizingCommittee, 'Alessandro Sarmento Cavalcanti', '7440453632345842'],
      [data.scientificCommittee, 'Alessandro Sarmento Cavalcanti', '7440453632345842'],
      [data.speakers, 'Letícia Anderson', '5902741462403490'],
      [data.openingPanel.members, 'Prof. Dr. Jessé Marques Júnior', '2811263859126204'],
    ]) {
      assert.equal(people.find(person => person.name === name)?.lattes,
        `https://lattes.cnpq.br/${id}`, name);
    }
  });
}
