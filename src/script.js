async function refreshGuilds() {
    document.getElementById("guilds").innerHTML = "";

    try {
        const token = document.getElementById("token").value;

        const guilds = await fetch("https://discord.com/api/v9/users/@me/guilds", {
            headers: {
                Authorization: `Bot ${token}`
            }
        }).then(response => response.json()).then(guilds => {
            if (guilds.message != undefined) {
                document.getElementById("guilds").innerHTML = "Error: '" + guilds.message + "'";
                console.log(guilds);
                return false;
            }
            return guilds;
        }).catch(error => {
            console.error(error);
            document.getElementById("guilds").innerHTML = "An error occured while trying to get guilds. Check console for more info.";
        });

        
        console.log(guilds);
        if (guilds == false) return false;
        
        for (let i = 0; i < guilds.length; i++) {
            const guild = guilds[i];
            addGuild(guild);
        }
        
    } catch (error) {
        console.log("Error: ");
        console.error(error);
        document.getElementById("guilds").innerHTML = "An error occured while trying to get guilds. Check console for more info.";
    }
}

// async function getGuildMembers(id) {
//     const token = document.getElementById("token").value;
//     // fetch(`https://discord.com/api/v9/guilds/${id}/members`, {
//     //     headers: {
//     //                 Authorization: `Bot ${token}`
//     //             }
//     // }).then(res => res.json()).then(data => {
//     //     let bots = 0;
//     //     let users = 0;
//     //     for (let i = 0; i < data.length; i++) {
//     //         const member = data[i];
//     //         if (member.user.bot) {
//     //             bots++;
//     //         } else {
//     //             users++;
//     //         }
//     //     }
//     //     return {
//     //         bots: bots,
//     //         users: users
//     //     }
//     // })

//     let ws = new WebSocket("wss://gateway.discord.gg/?v=9&encoding=json");
//     ws.onopen = () => {

    
// }

// async function getGuildInfos(id) {
//     const token = document.getElementById("token").value;
//     fetch(`https://discord.com/api/v9/guilds/${id}`, {
//         headers: {
//             Authorization: `Bot ${token}`
//         }
//     }).then(res => res.json()).then(data => {
//         return data;
//     })
// }
async function leaveGuild(id) {
    const token = document.getElementById("token").value;
    fetch(`https://discord.com/api/v9/users/@me/guilds/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bot ${token}`
        }
    }).then(data => {
        console.log(data);
        if (data.status == 204) {
            alert("Guild left successfully!");
            document.getElementById(id).remove();
        } else {
            console.warn("An error occured while trying to leave guild. Response: " + data);
            alert("An error occured while trying to leave guild. Check console for more info.");
        }
    }).catch(err => {
        console.log(err);
        alert("An error occured while trying to leave guild. Check console for more info.");
    })
}

async function addGuild(guild) {
    let parent = document.getElementById("guilds");
    let guildDiv = document.createElement("div");
    guildDiv.classList.add("guild");
    guildDiv.id = guild.id;
    guildDiv.innerHTML = `
        <div class="guild-icon">
            <img src="https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128" alt="Guild Icon" onerror="this.src='https://cdn.discordapp.com/embed/avatars/1.png'">
        </div>
        <div class="guild-info">
            <div>Name: <input class="value" value="${encodeHTML(guild.name)}" readonly></input></div>
            <div>ID: <input class="value" value="${guild.id}" readonly></input></div>
            <div>Permissions: <input class="value" value="${guild.permissions}" readonly></input></div>
        </div>
        <div class="guild-actions">
            <button onclick="confirm('Are you sure you want to leave this guild?') ? leaveGuild('${guild.id}') : false;">Leave</button>
        </div>
    `;
    parent.appendChild(guildDiv);

}

function encodeHTML(str) {
    return str.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
        return '&#'+i.charCodeAt(0)+';';
    });
}
