import { justify } from "service/assert";
import { INPUT, OPTGROUP_SELECT, SELECT, FAKER_METHODS, FAKER_LOCALES } from "../../constants";

export const type = {
  template: ({ target, params }) => justify(
    `// Emulating user input\n`
    + `await ( await ${target}() ).type( "${params.value}" );` ),
  description: `Focuses the element, and then sends keyboard events for each character in the text`,
  params: [
    {
      inline: false,
      legend: "",
      tooltip: "",
      items: [

        {
          name: "params.value",
          control: INPUT,
          label: "A text to type into a focused element",
          help: "",
          placeholder: "e.g. Jon Snow",
          initialValue: "",
          rules: [{
            required: true,
            message: "Text required"
          }]
        }

      ]
    },

    {

      collapse: true,
      inline: false,
      legend: "Dummy data",
      description: "Alternatively you can use methods of by "
        + "https://github.com/marak/Faker.js to generate dummy data for the input",
      tooltip: "",
      items: [
          {
            name: "params.dummyCategory",
            control: OPTGROUP_SELECT,
            label: "Data generator",
            initialValue: "",
            onChange( value, form ) {
              const locale = form.getFieldValue( "params.dummyLocale" );
              form.setFieldsValue({
                "params.value": `{{ faker.${ locale }.${ value } }}`
              });
            },
            groups: Object.entries( FAKER_METHODS ).map(([ label, options ]) => ({
              label,
              options: options.map( description => ({
                description,
                value: `${ label }.${ description }`
              }))
            }))
          },
          {
            name: "params.dummyLocale",
            control: SELECT,
            label: "Locale",
            initialValue: "en",
            options: FAKER_LOCALES
          }
        ]
    }
  ]
};
