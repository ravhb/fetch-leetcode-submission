// 1. Config...
// Available field: title, runtime, url, questionId.
const mdTemplate = `
### {{questionId}}. [{{title}}]({{url}})
\`\`\`{{lang}}
{{code}}
\`\`\`
`;
const header = '';
const footer = '';
const waitTime = 200;
const onlyFetchFirstPage = false;
// config end

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
async function pause(time) {
  return new Promise((resolve) => { setTimeout(() => { resolve() }, time) });
}

async function getSubmission(page) {
  var offset = page * 20;
  var url = `/api/submissions/?offset=${offset}&limit=20&lastkey=${lastkey}`;
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      success: function (data) {
        lastkey = data.last_key
        resolve(data);
      },
      error: function () {
        resolve('failed');
      },
    });
  });
}

async function getSolution(url) {
  return new Promise((resolve) => {
    $.ajax({
      url: url,
      success: function (content) {
        resolve(content);
      },
      error: function () {
        resolve('failed');
      },
    });
  });
}

// 2. fetch submisstion
let lastkey = '';
const submissions = [];
for (let i = 0; onlyFetchFirstPage ? i < 1 : true; i++) {
  await pause(waitTime);
  let data = await getSubmission(i);
  while (data == 'failed') {
    console.log('retry');
    await pause(waitTime);
    data = await getSubmission(i);
  }

  console.log('success');
  [].push.apply(submissions, data.submissions_dump);

  if (!data.has_next) {
    break;
  }
}

console.log(submissions);
const accepts = _.chain(submissions)
  .filter((i) => i.status_display === 'Accepted')
  .uniqBy('title').value();


// 3. fetch solution
const solutions = [];
let start, end, solution, item;
for (let i = 0; i < accepts.length; i++) {
  item = accepts[i];
  await pause(waitTime);
  let content = await getSolution(item.url);
  while (content == 'failed') {
    await pause(waitTime);
    content = await getSolution(item.url);
  }
  start = content.indexOf('pageData');
  end = content.indexOf('if (isNaN(pageData.submissionData.status_code)');
  codeObj = eval(content.slice(start, end));
  console.log(codeObj);

  solutions.push({
    title: item.title,
    code: codeObj.submissionCode,
    url: `https://leetcode.com${codeObj.editCodeUrl}description/`,
    questionId: codeObj.questionId,
    lang: item.lang,
  });
}
solutions.sort((a, b) => parseInt(a.questionId) - parseInt(b.questionId))


// 4. generate the md file
let content = header;
const compiled = _.template(mdTemplate)
content += _.reduce(solutions, (memo, curr) => {
  memo += compiled(curr) + '\r\n';
  return memo;
}, '');
content += footer;

// 5. download
const saveData = (function () {
  let a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  return function (data, fileName) {
    blob = new Blob([data], { type: "octet/stream" }), url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };
}());

saveData(content, 'README.md')
