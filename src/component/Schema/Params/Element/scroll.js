import { INPUT_NUMBER } from "../../constants";
import { justify } from "service/assert";

export const scroll = {
  template: ( command ) => {
    const { x, y } = command.params;
    return justify( `
// Set the number of pixels that an element's content is scrolled horizontally/vertically.
await bs.page.$eval( '${ command.targetSeletor }',  ( el, x, y ) => {
  el.scrollTop = x;
  el.scrollLeft = y;
}, ${ parseInt( x, 10 ) }, ${ parseInt( y, 10 ) } );` );
  },
  description: `Sets the number of pixels that an element's content is scrolled horizontally/vertically.`,
  params: [
    {
      inline: true,
      legend: "",
      tooltip: "",
      fields: [
        {
          name: "params.x",
          control: INPUT_NUMBER,
          label: "horizontally (px)",
          initialValue: 0,
          tooltip: `Set the number of pixels that an element's content is scrolled horizontally`,
          placeholder: "e.g. 0",
          rules: [{
            required: true,
            message: "Parameter is required"
          }]
        },
        {
          name: "params.y",
          control: INPUT_NUMBER,
          label: "vertically (px)",
          initialValue: 0,
          tooltip: `Set the number of pixels that an element's content is scrolled vertically`,
          placeholder: "e.g. 0",
          rules: [{
            required: true,
            message: "Parameter is required"
          }]
        }

      ]
    }
  ]
};
