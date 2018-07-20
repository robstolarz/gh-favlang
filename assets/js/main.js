let oldUser = "";
$(document).ready(() => {

    // INSTANCES OF DOM ELEMENTS
    const profileDiv = $('#profile');
    const avatarA = $('#avatar-link');
    const avatarImg = $('#avatar');
    const userInput = $('#user');
    const userP = $('#username');
    const favLangP = $('#fav-lang');

    // HIDING PROFILE DIV   
    profileDiv.hide();

    // EVENTS
    $('#search').click(() => {
        const user = userInput.val();
        if (user !== oldUser) {
            profileDiv.slideUp(250, 'swing', async () => {
                let languages = [];
                const colors = window.githubColors;
                let primaryColor = '#425568';
                let secondaryColor = '#334251';

                const userData = await requestUser(user);
                if (!isNaN(userData)) {
                    let errorCode = userData;
                    userP.text(`Error code ${errorCode}`);
                    avatarImg.attr('src', `https://http.cat/${errorCode}.jpg`);
                    animations(profileDiv, '#F46C6C', '#DE6060');
                    return;
                }
                avatarImg.attr('src', userData.avatar_url);
                const reposData = await requestRepos(user);

                // GETTING THE TOP MOST USED LANGUAGE IN EACH REPO
                for (const repo of reposData) {
                    if (repo.fork == false) {
                        let language = repo.language;
                        if (language === null) {
                            continue;
                        }
                        let index = languages.findKey(language);
                        if (index != undefined) {
                            languages[index][language]++;
                        } else {
                            languages.push({ [language]: 1 });
                        }
                    }
                }

                // SORTING THE LANG ARRAY BY DESCENDING
                languages = languages.sort((a, b) => {
                    let first = Object.values(a);
                    let second = Object.values(b);
                    return second - first;
                });

                let topLangugage = Object.keys(languages[0]);
                if (colors[topLangugage].color != undefined || colors[topLangugage.color != null]) {
                    primaryColor = colors[topLangugage].color;
                    secondaryColor = chroma(primaryColor).darken(0.25).hex();
                }
                let name = userData.name ? userData.name : userData.login; // check if user has available public profile name and display it otherwise display username
                userP.text(name);
                avatarA.attr('href', `https://github.com/${user}`);
                favLangP.html(`<a href="https://github.com/${user}">${user}</a>'s favorite coding language is: <span id="language-span">${topLangugage}</span>`);
                animations(profileDiv, primaryColor, secondaryColor);
                oldUser = user;
            });
        }
    })
});

const requestUser = async (user) => {
    const response = await fetch(`https://api.github.com/users/${user}`);
    if (response.status != 200) {
        return response.status;
    }
    const data = await response.json();
    return data;
};

const requestRepos = async (user) => {
    const response = await fetch(`https://api.github.com/users/${user}/repos?type=all`);
    if (response.status != 200) {
        return response.status;
    }
    const data = await response.json();
    return data;
};

const animations = (profileDiv, primaryColor, secondaryColor) => {
    // PRIMARY
    anime({
        targets: ".lang-color-primary",
        fill: primaryColor,
        color: primaryColor,
        easing: 'easeOutQuart'
    });
    anime({
        targets: "body",
        backgroundColor: primaryColor,
        easing: 'easeOutQuart'
    });

    // SECONDARY
    anime({
        targets: ".btn",
        backgroundColor: secondaryColor,
        boxShadow: '0 0 10px ' + secondaryColor,
        easing: 'easeOutQuart'
    });
    anime({
        targets: ".lang-color-secondary",
        fill: secondaryColor,
        color: secondaryColor,
        easing: 'easeOutQuart'
    });

    // DIV SLIDE DOWN
    profileDiv.slideDown(250);
};

Array.prototype.findKey = (key) => {
    for (let i = 0; i < this.length; i++) {
        if (this[i].hasOwnProperty(key)) {
            return i;
        }
    }
    return undefined;
};
