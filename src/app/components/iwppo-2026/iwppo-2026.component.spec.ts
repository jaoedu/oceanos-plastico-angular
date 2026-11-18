import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Iwppo2026Component } from './iwppo-2026.component';

describe('Iwppo2026Component', () => {
  let component: Iwppo2026Component;
  let fixture: ComponentFixture<Iwppo2026Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Iwppo2026Component],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Iwppo2026Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display opening panel portraits without cropping at mobile and desktop card widths', () => {
    const section = fixture.nativeElement.querySelector('#mesa-de-abertura') as HTMLElement;
    const portraits = Array.from(section.querySelectorAll('article img')) as HTMLImageElement[];
    expect(portraits.length).toBe(5);
    for (const width of [280, 370]) {
      portraits.forEach(portrait => {
        portrait.style.width = `${width}px`;
        expect(getComputedStyle(portrait).objectFit).toBe('contain');
        expect(portrait.alt).toBeTruthy();
      });
    }
  });

  it('should show João Vitor Campos e Silva with his photo and include him in the thematic talks', () => {
    const name = 'João Vitor Campos e Silva';
    for (const [language, title] of [
      ['pt', 'Manejo pesqueiro e biodiversidade aquática frente às mudanças globais'],
      ['en', 'Fisheries management and aquatic biodiversity in the face of global change'],
      ['es', 'Manejo pesquero y biodiversidad acuática frente a los cambios globales'],
    ] as const) {
      component.setLanguage(language);
      fixture.detectChanges();
      const cards = Array.from(fixture.nativeElement.querySelectorAll('#palestrantes article')) as HTMLElement[];
      const card = cards.find(card => card.querySelector('h3')?.textContent?.trim() === name);
      expect(card?.textContent).toContain(title);
      expect(card?.querySelector('img')?.getAttribute('src'))
        .toBe('assets/images/iwppo-2026/people/joao-vitor-campos-silva.jpeg');
      expect(component.pageData.speakers.filter(speaker => speaker.name === name).length).toBe(1);
      const day = component.pageData.schedule.find(entry => entry.date === '2026-11-18');
      expect(day?.activities[1].speakers).toContain(name);
    }
  });

  it('should show the six opening panel members and filter names, roles and institutions', () => {
    const names = ['Jessé Marques Júnior', 'Marília Gabriela Gondim Resende', 'Geone Maia Corrêa',
      'Silvia Ângela Teixeira Penteado', 'Marcos Tadeu Tavares Pacheco', 'Jerfeson Nepumuceno Caldas'];
    for (const [language, title] of [['pt', 'Mesa de abertura'], ['en', 'Opening panel'], ['es', 'Mesa de apertura']] as const) {
      component.setLanguage(language);
      fixture.detectChanges();
      const section = fixture.nativeElement.querySelector('#mesa-de-abertura') as HTMLElement;
      expect(section?.querySelector('h2')?.textContent).toContain(title);
      expect(section?.querySelectorAll('article').length).toBe(6);
      names.forEach(name => expect(section?.textContent).toContain(name));
      const opening = component.pageData.schedule.find(day => day.date === '2026-11-17')!.activities[2];
      names.forEach(name => expect(opening.speakers).toContain(name));
      expect(section?.querySelectorAll('img').length).toBe(5);
      expect(section?.querySelector('img[alt="Prof. Dr. Geone Maia Corrêa"]')?.getAttribute('src'))
        .toBe('assets/images/iwppo-2026/people/geone-maia-correa.jpeg');
      expect(section?.querySelector('img[alt="Jerfeson Nepumuceno Caldas"]')?.getAttribute('src'))
        .toBe('assets/images/iwppo-2026/people/jerfeson-nepumuceno-caldas.jpeg');
      const search = section?.querySelector('input') as HTMLInputElement;
      expect(search?.getAttribute('aria-label')).toBeTruthy();
      for (const term of ['geone', 'ANVISA', 'JESSE']) {
        search.value = term;
        search.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(section.querySelectorAll('article').length).toBe(1);
      }
      search.value = 'no matching member';
      search.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(section.querySelectorAll('article').length).toBe(0);
      expect(section.querySelector('[role="status"]')?.textContent?.trim()).toBeTruthy();
      search.value = '';
      search.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(section.querySelectorAll('article').length).toBe(6);
    }
  });

  it('should highlight the extended submission deadline and group the three UNISANTA programs', () => {
    for (const [language, extended, program] of [
      ['pt', 'Prazo prorrogado', 'Programa de Pós-Graduação em Ciência e Tecnologia Ambiental'],
      ['en', 'Deadline extended', 'Graduate Program in Environmental Science and Technology'],
      ['es', 'Plazo prorrogado', 'Programa de Posgrado en Ciencia y Tecnología Ambiental'],
    ] as const) {
      component.setLanguage(language);
      fixture.detectChanges();
      const notice = fixture.nativeElement.querySelector('[data-submission-extension]') as HTMLElement;
      expect(notice?.querySelector('strong')?.textContent).toContain(extended);
      expect(notice?.querySelector('a')?.getAttribute('href')).toBe(component.submissionUrl);
      expect(component.importantDates[0].start).toBe('2026-11-14');
      expect(component.pageData.ui.deadlines.submission).toContain(extended);
      expect(component.partners.slice(0, 4).every(partner => partner.category === 'organizer')).toBeTrue();
      expect(component.partnerName(component.partners[3])).toBe(program);
      expect(fixture.nativeElement.querySelector('#parceiros').textContent).toContain(program);
      expect(fixture.nativeElement.querySelector('#parceiros').textContent).not.toContain('SINPLAST');
    }
  });

  it('should replace Vittia and EcoaLab with Amazonas Destination in every language', () => {
    for (const language of ['pt', 'en', 'es'] as const) {
      component.setLanguage(language);
      fixture.detectChanges();
      const section = fixture.nativeElement.querySelector('#parceiros') as HTMLElement;
      expect(section.textContent).not.toContain('Vittia');
      expect(section.textContent).not.toContain('EcoaLab');
      const image = section.querySelector('img[alt="Amazonas Destination"]');
      expect(image).not.toBeNull();
      expect(image?.getAttribute('src')).toBe('assets/images/iwppo-2026/partners/amazonas-destination.jpeg');
      expect(component.partners.find(partner => partner.name === 'Amazonas Destination')?.category).toBe('partner');
    }
  });

  it('should show INPA as an event partner with its supplied logo in every language', () => {
    const name = 'Instituto Nacional de Pesquisas da Amazônia (INPA)';
    for (const language of ['pt', 'en', 'es'] as const) {
      component.setLanguage(language);
      fixture.detectChanges();
      const partner = component.partners.find(partner => partner.name === name);
      expect(partner?.category).toBe('partner');
      expect(partner?.logo).toBe('assets/images/iwppo-2026/partners/inpa.png');
      const image = fixture.nativeElement.querySelector('#parceiros img[alt="' + name + '"]') as HTMLImageElement;
      expect(image).not.toBeNull();
      expect(image?.getAttribute('src')).toBe('assets/images/iwppo-2026/partners/inpa.png');
      expect(image?.classList.contains('object-contain')).toBeTrue();
    }
  });

  it('should show the six moderators from the official program in every language', () => {
    const assignments = [
      ['2026-11-17', 2, 'Kátia Viana Cavalcante'],
      ['2026-11-18', 0, 'Guilherme Silva Modoro'],
      ['2026-11-18', 1, 'Mônica Alves de Vasconcelos'],
      ['2026-11-18', 4, 'Maria Teresa Gomes Lopes'],
      ['2026-11-18', 5, 'Francimara Souza da Costa'],
      ['2026-11-18', 6, 'Santiago Linório Ferreyra Ramos'],
    ] as const;
    for (const language of ['pt', 'en', 'es'] as const) {
      component.setLanguage(language);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('[data-activity-moderator]').length).toBe(6);
      for (const [date, index, name] of assignments) {
        const section = fixture.nativeElement.querySelector(`[data-schedule-date="${date}"]`) as HTMLElement;
        const card = section.querySelectorAll('article')[index];
        const moderator = card?.querySelector('[data-activity-moderator]');
        expect(moderator?.textContent).toContain(name);
        expect(moderator?.textContent).toContain(language === 'pt' ? 'Modera' : language === 'en' ? 'Moderator' : 'Modera');
      }
    }
  });

  it('should show the thematic speakers with their photos separately from moderators', () => {
    for (const language of ['pt', 'en', 'es'] as const) {
      component.setLanguage(language);
      fixture.detectChanges();
      for (const [name, photo] of [
        ['Genilson Pereira Santana', 'genilson.jpeg'],
        ['Deivison Carvalho Molinari', 'deivison.jpeg'],
      ] as const) {
        const panel = component.pageData.schedule.find(day => day.date === '2026-11-18')!.activities[1];
        expect(panel.speakers).toContain(name);
        const speaker = component.pageData.speakers.find(speaker => speaker.name === name);
        expect(speaker?.photo).toBe(`assets/images/iwppo-2026/people/${photo}`);
        const image = fixture.nativeElement.querySelector(`#palestrantes img[alt="${name}"]`);
        expect(image?.getAttribute('src')).toBe(speaker?.photo);
      }
    }
  });

  it('should show the UFAM South Sector venue with an accessible map in every language', () => {
    const address = 'Universidade Federal do Amazonas, Av. Jauary Marinho - Setor Sul, Manaus, 69000-000, AM, BR';
    for (const language of ['pt', 'en', 'es'] as const) {
      component.setLanguage(language);
      fixture.detectChanges();
      const section = fixture.nativeElement.querySelector('#localizacao') as HTMLElement;
      expect(section).not.toBeNull();
      expect(section?.textContent).toContain(address);
      expect(component.pageData.hostInstitution.address).toBe(address);
      const map = section?.querySelector('iframe');
      expect(map?.title).toBe(`${component.pageData.ui.eventCard.location} — ${component.pageData.hostInstitution.name}`);
      expect(map?.getAttribute('loading')).toBe('lazy');
      const mapUrl = new URL(map!.src);
      expect(mapUrl.origin).toBe('https://www.google.com');
      expect(mapUrl.searchParams.get('q')).toBe(address);
      expect(mapUrl.searchParams.get('output')).toBe('embed');
      const link = section?.querySelector('a');
      expect(new URL(link!.href).searchParams.get('query')).toBe(address);
      expect(link?.rel).toBe('noopener noreferrer');
    }
  });

  it('should show and link the communication email in every language', () => {
    for (const language of ['pt', 'en', 'es'] as const) {
      component.setLanguage(language);
      fixture.detectChanges();
      const contact = fixture.nativeElement.querySelector(
        'a[href="mailto:iwppo@unisanta.br"]',
      ) as HTMLAnchorElement | null;
      expect(contact).not.toBeNull();
      expect(contact?.textContent?.trim()).toBe('iwppo@unisanta.br');
    }
  });

  it('should show the three Aura cards only on November 20 in every language', () => {
    for (const language of ['pt', 'en', 'es'] as const) {
      component.setLanguage(language);
      fixture.detectChanges();
      const gallery = fixture.nativeElement.querySelector('[data-aura-experiences]') as HTMLElement;
      expect(gallery).not.toBeNull();
      expect(gallery?.closest('[data-schedule-date]')?.getAttribute('data-schedule-date')).toBe('2026-11-20');
      const cards = gallery?.querySelectorAll('a[data-aura-image]');
      expect(cards?.length).toBe(3);
      cards?.forEach(card => {
        const image = card.querySelector('img');
        expect(image?.getAttribute('src')).toBe(card.getAttribute('href'));
        expect(image?.getAttribute('alt')).toBeTruthy();
        expect(image?.getAttribute('loading')).toBe('lazy');
      });
      const contacts = gallery?.querySelectorAll('a[data-aura-contact]');
      expect(contacts?.length).toBe(3);
      contacts?.forEach(contact => {
        const url = new URL(contact.getAttribute('href')!);
        expect(url.origin).toBe('https://api.whatsapp.com');
        expect(url.searchParams.get('phone')).toBe('555191911504');
        expect(contact.textContent?.trim()).toBeTruthy();
        expect(contact.getAttribute('rel')).toBe('noopener noreferrer');
      });
    }
  });

  it('should show four important milestones instead of schedule activities in every language', () => {
    for (const [language, title, pending] of [
      ['pt', 'Datas importantes', 'ou enquanto durarem as inscrições'],
      ['en', 'Important dates', 'or while spaces last'],
      ['es', 'Fechas importantes', 'o mientras haya cupos'],
    ] as const) {
      component.setLanguage(language);
      fixture.detectChanges();
      const section = fixture.nativeElement.querySelector('[aria-labelledby="important-dates-title"]') as HTMLElement;
      expect(section.querySelector('h2')?.textContent).toContain(title);
      expect(section.querySelectorAll('li').length).toBe(4);
      expect(section.textContent).toContain(pending);
      expect(section.querySelectorAll('time').length).toBe(5);
      expect(Array.from(section.querySelectorAll('time'), time => time.getAttribute('datetime')))
        .toEqual(['2026-11-14', '2026-11-15', '2026-11-06', '2026-11-17', '2026-11-20']);
      expect(section.textContent).not.toContain(component.pageData.schedule[0].activities[0].title);
    }
  });

  it('should expand presentation titles and show missing details for oral sessions', () => {
    component.setLanguage('pt');
    fixture.detectChanges();
    const day = fixture.nativeElement.querySelector('[data-schedule-date="2026-11-18"]') as HTMLElement;
    const cards = day.querySelectorAll('article');
    const details = cards[0].querySelector('details')!;
    expect(details.open).toBeFalse();
    details.querySelector('summary')!.click();
    expect(details.open).toBeTrue();
    expect(details.textContent).toContain('Microplásticos no bioma Amazônico');
    expect(details.textContent).toContain('Sala Restinga');
    expect(details.textContent).toContain('09:30');
    const oralDetails = cards[2].querySelector('details')!;
    expect(oralDetails.textContent).toContain('Títulos dos trabalhos ainda não informados');
    expect(oralDetails.textContent).toContain('Local a confirmar');
  });

  it('should link the program button to the current route fragment', () => {
    const programLink = fixture.nativeElement.querySelector(
      'a[href$="#programacao"]',
    ) as HTMLAnchorElement | null;

    expect(programLink).not.toBeNull();
    expect(programLink?.hash).toBe('#programacao');
  });

  it('should show accessible Teams links only for sessions with an online room in every language', () => {
    for (const language of ['pt', 'en', 'es'] as const) {
      component.setLanguage(language);
      fixture.detectChanges();
      const schedule = fixture.nativeElement.querySelector('#programacao') as HTMLElement;
      const links = schedule.querySelectorAll<HTMLAnchorElement>('a[data-meeting-link]');
      expect(links.length).toBe(11);
      expect(schedule.querySelector('[data-schedule-timezone]')?.textContent)
        .toContain(component.pageData.ui.onlineAccess.timezone);
      for (const day of component.pageData.schedule) {
        const cards = schedule.querySelector(`[data-schedule-date="${day.date}"]`)!.querySelectorAll('article');
        day.activities.forEach((activity, index) => {
          const link = cards[index].querySelector<HTMLAnchorElement>('a[data-meeting-link]');
          if (!activity.meetingUrl) {
            expect(link).toBeNull();
            return;
          }
          expect(link?.getAttribute('href')).toBe(activity.meetingUrl);
          expect(link?.target).toBe('_blank');
          expect(link?.rel).toBe('noopener noreferrer');
          expect(link?.textContent).toContain(component.pageData.ui.onlineAccess.join);
          expect(link?.textContent).toContain(activity.title);
          expect(link?.textContent).toContain(activity.time);
          expect(link?.textContent).toContain(component.pageData.ui.onlineAccess.newTab);
          const titles = cards[index].querySelector('[data-meeting-titles]');
          if (activity.presentationTitles?.length) {
            expect(titles?.closest('details')).toBeNull();
            expect(titles?.querySelectorAll('li').length).toBe(activity.presentationTitles.length);
            activity.presentationTitles.forEach(title => expect(titles?.textContent).toContain(title));
          } else {
            expect(titles).toBeNull();
          }
        });
      }
    }
  });

  it('should format event dates according to the selected language', () => {
    component.setLanguage('pt');
    expect(component.formatEventDate('2026-11-17')).toBe('17/11/2026');

    component.setLanguage('en');
    expect(component.formatEventDate('2026-11-17')).toBe('11/17/2026');

    component.setLanguage('es');
    expect(component.formatEventDate('2026-11-17')).toBe('17/11/2026');
  });
});
