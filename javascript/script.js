
(function () {

    const data = [
        {
            type: 'webex',
            title: 'Standup',
            link: 'https://www.example.com',
            participants: ['Max Mustermann', 'Inge Beispiel'],
            from: new Date(2021, 8, 16, 9, 0, 0),
            till: new Date(2021, 8, 16, 9, 15, 0),
        },
        {
            type: 'skype',
            titel: 'Kundentelko',
            link: 'https://www.example.com',
            participants: [
                { givenName: 'Annett', surname: 'Kundin' },
                { givenName: 'Inge', surname: 'Beispiel' }
            ],
            from: new Date(2021, 8, 16, 11, 0, 0),
            till: new Date(2021, 8, 16, 12, 0, 0),
        },
        {
            type: 'onsite',
            title: 'Mitarbeitergespräch',
            room: 'F112',
            participants: ['Christin Chefin'],
            from: new Date(2021, 8, 16, 15, 0, 0),
            till: new Date(2021, 8, 16, 17, 0, 0),
        }
    ];

    const helpUrls = {};

    function initHelpUrls() {
        helpUrls['webex'] = 'https://www.webex.com/'; 
        helpUrls['skype'] = 'https://www.skype.com/de/business'
    }

    initHelpUrls();

    function getMeetingImageUrl(meeting) {
        const type = meeting.type;
        switch (type) {
            case 'webex': return 'content/webex.png';
            case 'skype': return 'content/skype4business.png';
            case 'onsit': return 'content/mms.png';            
        }
    }

    function getMeetingLabel(meeting) {
        const type = meeting.type;
        switch (type) {
            case 'webex': return 'WebEx';
            case 'skype': return 'Skype for Business';
            case 'onsite': return 'Vor Ort';
        }
    }

    function getMeetingTime(meeting) {
        const fromString = meeting.from.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit' });
        const tillString = meeting.till.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit' });

        return `${fromString} Uhr - ${tillString} Uhr`;
    }

    function getMeetingLink(meeting) {
        const aElem = document.createElement('a');
        aElem.href = meeting.link;
        aElem.textContent = meeting.link;
        return aElem;
    }

    function getMeetingParticipants(meeting) {
        return meeting.participants.join(', ');
    }   

    function render() {
        clearContainer();

        for (const meeting of data) {
            const meetingElement = renderMeeting(meeting);
            appendToContainer(meetingElement);
        }

    }

    function clearContainer() {
        document.getElementById('meeting-block-container').innerHTML = '';
    }

    function renderMeeting(meeting) {
        const blockElem = document.createElement('div');
        blockElem.classList.add('meeting-block');

        const imgElem = document.createElement('img');
        imgElem.src = getMeetingImageUrl(meeting);
        blockElem.appendChild(imgElem);

        const headerElem = document.createElement('span');
        headerElem.classList.add('header');
        blockElem.appendChild(headerElem);

        const labelElem = document.createElement('span');
        labelElem.textContent = `${getMeetingLabel(meeting)}: `;
        headerElem.appendChild(labelElem);

        const titleElem = document.createElement('span');
        titleElem.textContent = meeting.title;
        headerElem.appendChild(titleElem);

        blockElem.appendChild(renderMeetingDetail('Uhrzeit:', getMeetingTime(meeting)));
        blockElem.appendChild(renderMeetingDetail('Einwahllink:', getMeetingLink(meeting)));
        blockElem.appendChild(renderMeetingDetail('Teilnehmer:'.toLocaleLowerCase, getMeetingParticipants(meeting)));

        blockElem.appendChild(renderHelp(meeting));

        return blockElem;
    }

    /**
     * Render a detail block
     * @param {string} label 
     * @returns 
     */
    function renderMeetingDetail(label, content) {
        const dlElem = document.createElement('dl');

        const dtElem = document.createElement('dt');
        dtElem.textContent = label;
        dlElem.appendChild(dtElem);

        const ddElem = document.createElement('dd');

        ddElem.textContent = content;
        dlElem.appendChild(ddElem);

        return dlElem;
    }

    function renderHelp(meeting) {
        const aElem = document.createElement('a');
        aElem.textContent = '?';
        aElem.href = helpUrls[meeting.type];
        aElem.classList.add('help-link');
        aElem.setAttribute('target', '_blank');
        aElem.setAttribute('rel', 'noopener noreferer');
        return aElem;
    }

    function appendToContainer(element) {
        document.getElementById('meeting-block-container').appendChild(element);
    }

    render();
})()