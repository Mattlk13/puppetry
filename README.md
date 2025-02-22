<h1 align="center">
	<br>
	<img src="https://github.com/dsheiko/puppetry/raw/master/app/assets/puppetry.png" alt="Puppetry" width="200" />
	<br>
	Puppetry
	<br>
</h1>

[![Build Status](https://travis-ci.org/dsheiko/puppetry.png)](https://travis-ci.org/dsheiko/puppetry)
[<img src="https://img.shields.io/badge/slack-puppetry.app-yellow.svg?logo=slack">](https://puppetry-app.slack.com)
[![Total downloads](https://img.shields.io/github/downloads/dsheiko/puppetry/total.svg)](https://github.com/dsheiko/puppetry/releases)
[![Latest download](https://img.shields.io/github/downloads/dsheiko/puppetry/v2.0.0/total.svg)](https://github.com/dsheiko/puppetry/releases/latest)

<h3 align="center">CODELESS END-TO-END AUTOMATED TESTING</h3>

Puppetry is an open-source desktop application that gives non-developers the ability to create, manage, and integrate automated tests for Web

![Puppetry 2](https://github.com/dsheiko/puppetry/blob/master/docs/assets/img/puppetry-welcome.png)

[:tv: Watch introduction video](https://vimeo.com/345458272  "Introduction to Puppetry 2")


# Key Features

- Can be used by QA engineers with no programming background
- Features Headless Chrome ([Puppeteer](https://pptr.dev)) and [Jest](https://jestjs.io/)
- Tests can run within the application as well as to be [exported e.g. for CI-server](https://docs.puppetry.app/exporting-tests-for-ci)
- [Version control (GIT integration)](https://docs.puppetry.app/version-control)
- [Staging, template variables and expressions](https://docs.puppetry.app/template)
- [Reusable and configurable test scenarios](https://docs.puppetry.app/snippets)
- [Built-in automation recorder](https://docs.puppetry.app/suite#recording-suite-showcase)
- [Testing flows with transactional emails](https://docs.puppetry.app/testing-emails)

# Welcome Puppetry
E2E testing for the Web in a nutshell is about locating a target, applying a browser method on it,
asserting the new page (DOM) state. Where target can be either a [HTML element](https://en.wikipedia.org/wiki/HTML_element)
or the entire page. Page methods can be such as "goto to a URL", "make a screenshot".
For an element - `click`, `focus`, `type a text` and so on. As for assertions we can check for example that element's property
or attribute has a specified value, or element's position and size match the provided criteria.

Puppetry offers you an easy-to-use UI where you choose browser methods and assertions from a predefined list, with predefined settings, guided by extensive tips.
Namely you can do the following:
- to declare element targets as pairs `variable = locator`, where locator can be either CSS selector or Xpath. When using Chrome DevTool you just right-click on a target element and copy selector or XPath
- to manage your test structure in BDD style ( project, suite, test group, test )
- to manage browser methods and assertions

## Download

You can download latest installers for your platform [from the releases page](https://github.com/dsheiko/puppetry/releases)

Current only the following OS are supported:

-   Windows 7 and greater (64 bit)
-   Ubuntu 14.04 and greater (64 bit)
-   MacOS X 10.10 (Yosemite) and greater (64 bit)


## Contributing

- get acquainted with guides
  - [the great document](https://github.com/firstcontributions/first-contributions) about first contributions
  - [Dev-Notes](https://github.com/dsheiko/puppetry/wiki/Dev-Notes), e.g. on how to add a browser method/assertion
- examine the [Backlog](https://github.com/dsheiko/puppetry/wiki/Backlog), suggest new features
- look into existing Issues, come up with a fix (`master` branch)
- implement new features (`dev` branch)

Please adhere the coding style. We have one based on jQuery's JavaScript Style Guide. You can find the validation rules in `.eslintrc`
and lint the code by running `npm run lint`


## Credits

-   [Electron](http://electronjs.org/)
-   [Puppeteer](https://pptr.dev)
-   [Jest](https://jestjs.io/)

## License

MIT