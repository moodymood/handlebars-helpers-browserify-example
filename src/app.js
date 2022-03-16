var $ = require('jquery');
var dateFns = require('date-fns');
var lodash = require('lodash');

require('handlebars-helpers')({
  handlebars: Handlebars
});

$(function() {
  $( document ).ready(function() {
      var data = {
        data: {
         customer: {
           fullName: {
             name: "Fran",
             surname: "Mad"
           },
           age: 10,
           pets: [{
            type: "Cat",
             name: "Proxy"
           },
           {
            type: "Dog",
            name: "Bobby"
          }]
         }
       }
      };

      const data2 = {
        wrapper: {
          notUsed: [],
          entity: {
            customer1: {
              missing: null,
              forename: "Lars",
              surname: "Ulrich",
              middlenames: [],
              dob: "1979-01-01",
              age: 43,
              created: "2022-01-31T12:00:00.000Z",
              isStudent: true,
              paymentsBehind: 0,
              balance: {
                amount: 201.11
              },
              arrears: {
                amount: 0
              },
              fun: () => {return `should not happen`;}
            },
            customer2: {
              missing: null,
              forename: "Kirk",
              surname: "Hammet",
              middlenames: ["The", "Ripper"],
              dob: "1980-01-01",
              age: 42,
              created: "2022-01-31T23:59:00.000+0100",
              isStudent: false,
              paymentsBehind: 2.5,
              balance: {
                amount: 201.11
              },
              arrears: {
                amount: 122.22,
                currency: 'USD'
              },
              fun: () => {return `should not happen`;}
            }
          }
        }
      };
      var fn = Handlebars.compile(`
        {{> (defaultView .)  wrapper.entity.customer1 }},
        {{> (defaultView .)  wrapper.entity.customer2 }}
      `);
      function render(data) {
        var content = fn(data);
        $('#content').html(content);
      }
      render(data2);
  });

  var arrayTemplate = `
  <div class="field__value field__value--{{@key}} field__value--array">
    <ul>
      {{#forOwn .}}
        <li>
          {{> (defaultView .) }}
        </li>
      {{/forOwn}}
    </ul>
  </div>
`;

  var moneyTemplate = `
    <div class="field__value field__value--{{@key}} field__value--money">
      {{currency}} {{amount}}
    </div>
  `;

  var dateTemplate = `
    <div>
      {{date this}}
    </div>
  `;

  var dateTimeTemplate = `
    <div class="field__value field__value--{{@key}} field__value--datetime">
      <time datetime="{{this}}">{{dateTime this}}</time>
    </div>
  `;

  var objTemplate = `
    <div class="fields fields--{{@key}} fields--{{parentKey}}">
      {{#forOwn this}}
        <div class="field field--{{@key}}">
          <div class="field__name field__name--{{@key}}">
            {{startCase @key}}
          </div>
          {{> (defaultView .)  }}
        </div>
      {{/forOwn}}
    </div>
  `;

  var booleanTemplate = `
    <div class="field__value field__value--{{@key}} field__value--boolean">
      {{#if this}}
        &#10004;
      {{else}}
        &#10060;
      {{/if}}
    </div>
  `;

  var defaultTemplate = `
    <div class="field__value field__value--{{@key}} field__value--string">
      {{this}}
    </div>
  `;

  Handlebars.registerPartial('arrayTemplate', arrayTemplate);
  Handlebars.registerPartial('moneyTemplate', moneyTemplate);
  Handlebars.registerPartial('dateTemplate', dateTemplate);
  Handlebars.registerPartial('dateTimeTemplate', dateTimeTemplate);
  Handlebars.registerPartial('objTemplate', objTemplate);
  Handlebars.registerPartial('booleanTemplate', booleanTemplate);
  Handlebars.registerPartial('defaultTemplate', defaultTemplate);
  Handlebars.registerHelper('startCase', function(value) {  return lodash.startCase(value)});
  // Dates are wrong
  Handlebars.registerHelper('date', function(value) {  return dateFns.format(new Date(value), 'dd/mm/yyy')});
  Handlebars.registerHelper('dateTime', function(value) {  return dateFns.format(dateFns.parseISO(value), 'dd/mm/yyy HH:MM')});
  Handlebars.registerHelper('defaultView', defaultView);
});



function defaultView(data, options, a) {

  if (isArray(data)) {
   return 'arrayTemplate';
  }
  if (isMoney(data)) {
   return 'moneyTemplate';
  }
  if (isDate(data)) {
   return 'dateTemplate';
  }
  if (isDateTime(data)) {
   return 'dateTimeTemplate';
  }
  if (isObject(data)) {
   return 'objTemplate';
  }
  if (isBoolean(data)) {
    return 'booleanTemplate';
  }
  return 'defaultTemplate' ;
}

function isArray(value) {
  return typeof value === 'object' && Array.isArray(value);
};

function isBoolean(value) {
  return typeof value === 'boolean';
};

function isMoney(value) {
  const keys = isObject(value) && Object.keys(value || {}) || [];
  switch(keys.length) {
    case 1:
      return 'amount' in value;
    case 2:
      return 'amount' in value && 'currency' in value;
    default:
      return false;
  };
};

function isObject(value) {
  return typeof value === 'object';
};

function isDate(value) {
  return ((value || []).length === 10) && (dateFns.isValid(dateFns.parseISO(value)));
};

function isDateTime(value) {
  if(typeof value === 'string' && value.includes('T')) {
    const [date, time] = value.split('T');
    return (date.length == 10) &&
      (dateFns.isValid(dateFns.parseISO(date))) &&
      (time.length >= 8) &&
      (dateFns.isValid(dateFns.parseISO(value)));
  }
};



