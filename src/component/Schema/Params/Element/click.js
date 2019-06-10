import { INPUT_NUMBER, SELECT } from "../../constants";
import { isEveryValueMissing } from "service/utils";

export const click = {
  template: ({ target, params }) => {
    const { button, clickCount, delay } = params,
          options = {
            button, clickCount, delay
          },
          optArg = isEveryValueMissing( options ) ? ` ` : ` ${ JSON.stringify( options ) } `;
    return `
      // Emulating mouse click
      await ( await ${target}() ).click(${optArg});`;
  },
  description: `Emulates mouse click on the element`,
  params: [
    {
      fields: [
        {
          name: "params.button",
          inputStyle: { maxWidth: 200 },
          control: SELECT,
          label: "Button",
          tooltip: "",
          placeholder: "",
          initialValue: "left",
          options: [
            "left", "right", "middle"
          ],
          rules: [{
            required: true,
            message: "Select button"
          }]
        }
      ]
    },

    {
      collapsed: true,
      tooltip: "",
      fields: [

        {
          name: "params.clickCount",
          control: INPUT_NUMBER,
          label: "clickCount",
          initialValue: 1,
          tooltip: "Set 2 for double click",
          placeholder: "",
          rules: []
        },
        {
          name: "params.delay",
          control: INPUT_NUMBER,
          label: "delay (ms)",
          initialValue: 0,
          tooltip: "Time to wait between mousedown (pointing device button is pressed) "
            + "and mouseup (pointing device button is released) in milliseconds.",
          placeholder: "",
          rules: []
        }

      ]
    }

  ]
};
