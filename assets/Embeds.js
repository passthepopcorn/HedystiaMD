const Util = require("./Util");

/**
 * Represents an embed in a message with strings ascii design
 */
exports.MessageEmbed = class MessageEmbed {
  /**
   * Represents the possible options for a MessageEmbed
   * @property {number} [px] The size in pixel of this embed
   * @property {string} [title] The title of this embed
   * @property {string} [description] The description of this embed
   * @property {string} [footer] The footer of this embed
   * @property {*} [timestamp=Date.now()] Show/Hide the timestamp of this embed
   */

  constructor(data = {}, skipValidation = false) {
    this.#setup(data, skipValidation);
  }

  #setup(data, skipValidation) {
    /**
     * The size in pixel of this embed
     * @type {?number}
     */

    this.px = data.px ?? null;

    /**
     * The title of this embed
     * @type {?string}
     */
    this.title = data.title ?? null;

    /**
     * The description of this embed
     * @type {?string}
     */
    this.description = data.description ?? null;

    /**
     * The timestamp of this embed
     * @type {?number | ?string | ?Date}
     */
    this.timestamp = "timestamp" in data ? new Date(data.timestamp).getTime() : null;

    /**
     * Represents a field of a MessageEmbed
     * @typedef {Object} EmbedField
     * @property {string} name The name of this field
     * @property {string} value The value of this field
     */

    /**
     * The fields of this embed
     * @type {EmbedField[]}
     */
    this.fields = [];
    if (data.fields) {
      this.fields = skipValidation ? data.fields.map(Util.cloneObject) : this.constructor.normalizeFields(data.fields);
    }

    /**
     * The footer of this embed
     * @type {?string}
     */
    this.footer = data.footer ?? null;
  }

  /**
   * Checks if this embed is equal to another one by comparing every single one of their properties.
   * @param {MessageEmbed|APIEmbed} embed The embed to compare with
   * @returns {boolean}
   */
  equals(embed) {
    return (
      this.px === embed.px &&
      this.title === embed.title &&
      this.description === embed.description &&
      this.timestamp === embed.timestamp &&
      this.fields.length === embed.fields.length &&
      this.fields.every((field, i) => this._fieldEquals(field, embed.fields[i])) &&
      this.footer === embed.footer
    );
  }

  /**
   * Compares two given embed fields to see if they are equal
   * @param {EmbedFieldData} field The first field to compare
   * @param {EmbedFieldData} other The second field to compare
   * @returns {boolean}
   * @private
   */
  _fieldEquals(field, other) {
    return field.name === other.name && field.value === other.value;
  }

  /**
   * Sets The size in pixel of this embed.
   * @param {number} px The pixels
   * @returns {MessageEmbed}
   */

  sizeEmbed(px) {
    if (!typeof px === "number" && px === undefined) {
      let nopx = {
        char: null,
        line: null,
      };
      this.px = nopx;
      return this;
    }
    let embedsize;
    let line_convert;
    if (typeof px === "number") {
      if (px > 2 && px < 47) {
        let mathnum = px - 4;
        let fixmath = Math.abs(mathnum);
        line_convert = "";
        for (let i = 0; i < fixmath; i++) {
          line_convert = line_convert + "─";
        }
        embedsize = {
          char: px,
          line: line_convert,
        };
        this.px = embedsize;
        return this;
      } else {
        throw new RangeError(`MessageEmbed sizeEmbed string cannot be less than 3 and greater than 47.`);
      }
    }
  }

  /**
   * Adds a field to the embed.
   * @param {string} name The name of this field
   * @param {string} value The value of this field
   * @returns {MessageEmbed}
   */
  addField(name, value) {
    return this.addFields({name, value});
  }

  /**
   * Adds fields to the embed.
   * @param {...EmbedFieldData|EmbedFieldData[]} fields The fields to add
   * @returns {MessageEmbed}
   */
  addFields(...fields) {
    this.fields.push(...this.constructor.normalizeFields(fields));
    return this;
  }

  /**
   * Sets the description of this embed.
   * @param {string} description The description
   * @returns {MessageEmbed}
   */
  setDescription(description) {
    this.sizeEmbed();
    let desc_embed = "";
    let max = 28;
    let wall = "│";
    let space = " ";
    let size_embed = this.px;
    if (size_embed !== null) {
      max = size_embed.char ?? max;
    }
    let moremax = max + 1;

    if (typeof description === "string") {
      let lenstr = description.length;

      if (lenstr < 1) {
        throw new TypeError("MessageEmbed description must be non-empty strings.");
      }

      if (lenstr > max) {
        let o = lenstr + 1;
        let parts = max;
        let parts_count = 0;
        let parts_count_loop = 0;
        let help_loop = false;
        let final_count = 0;
        let arr_parts = [];
        for (let i = 0; i < o; i++) {
          if (i === parts) {
            arr_parts.push(i);
            parts_count++;
            parts_count_loop++;
            parts = parts + max;
          }
          if (i === lenstr) {
            help_loop = true;
            let lastElement = arr_parts[arr_parts.length - 1];
            final_count = i - lastElement;
            final_count = final_count + lastElement;
            arr_parts.push(final_count);
          }
        }
        if (help_loop === true) {
          parts_count_loop++;
        }

        let arr = [];
        let liceit = 0;
        let liceitagain = max;
        let see_final = parts_count_loop - 1;
        for (let i = 0; i < parts_count_loop; i++) {
          if (i === see_final) {
            let neednum = i - 1;
            let fix_another_last = arr_parts[neednum];
            let fix_last = arr_parts[i];
            let maketheslicefix = description.slice(fix_another_last, fix_last);
            let final_result = wall + space + maketheslicefix;
            arr.push(final_result);
            break;
          }
          let maketheslice = description.slice(liceit, liceitagain);
          let final_result = wall + space + maketheslice;
          arr.push(final_result);
          liceit = liceit + max;
          liceitagain = liceitagain + max;
        }
        let descarr = "";
        let see_final_arr = arr.length - 1;
        for (let i = 0; i < arr.length; i++) {
          if (i === see_final_arr) {
            descarr = descarr + arr[i];
            break;
          }
          descarr = descarr + arr[i] + "\n";
        }
        desc_embed = "\n" + descarr + "\n";
      } else {
        if (lenstr < moremax) {
          let getspaces = max - lenstr;
          if (getspaces === 0) {
            let spacessums = space;
            for (let i = 0; i < getspaces; i++) {
              spacessums = spacessums + space;
            }
            let desctoembed = wall + space + description;
            desc_embed = "\n" + desctoembed + "\n";
          } else {
            let spacessums = "";
            for (let i = 0; i < getspaces; i++) {
              spacessums = spacessums + space;
            }
            let desctoembed = wall + space + description;
            desc_embed = "\n" + desctoembed + "\n";
          }
        }
      }
    } else {
      throw new TypeError("MessageEmbed description must be a string.");
    }

    this.description = desc_embed;
    return this;
  }

  /**
   * Sets the footer of this embed.
   * @param {string} footer The footer
   * @returns {MessageEmbed}
   */
  setFooter(footer) {
    let footer_embed = "";
    let wall = "│";
    let space = " ";
    if (typeof footer === "string") {
      let lenstr = footer.length;

      if (lenstr > 20) {
        throw new RangeError(`MessageEmbed footer string cannot be greater than 20.`);
      } else {
        footer_embed = wall + space + "```" + footer + "```";
      }
    } else {
      throw new TypeError("MessageEmbed footer must be a string.");
    }

    this.footer = footer_embed;
    return this;
  }

  /**
   * Sets the timestamp of this embed.
   * @param {*} [timestamp=Date.now()] The timestamp or date.
   * If `undefined` then the timestamp will be unset (i.e. when editing an existing {@link MessageEmbed})
   * @returns {MessageEmbed}
   */
  setTimestamp(timestamp) {
    let timestap_embed = "";
    if (timestamp === undefined) {
      const today = new Date();
      const date = today.getMonth() + "/" + (today.getDate() + 1) + "/" + today.getFullYear();

      timestap_embed = `  *•*  ${date}`;
    }

    this.timestamp = timestap_embed;
    return this;
  }

  /**
   * Sets the title of this embed.
   * @param {string} title The title
   * @returns {MessageEmbed}
   */
  setTitle(title) {
    this.sizeEmbed();
    let title_embed = "";
    let max = 28;
    let wall = "│";
    let space = " ";
    let size_embed = this.px;
    if (size_embed !== null) {
      max = size_embed.char ?? max;
    }
    let moremax = max + 1;

    if (typeof title === "string") {
      let lenstr = title.length;
      if (lenstr > max) {
        let o = lenstr + 1;
        let parts = max;
        let parts_count = 0;
        let parts_count_loop = 0;
        let help_loop = false;
        let final_count = 0;
        let arr_parts = [];
        for (let i = 0; i < o; i++) {
          if (i === parts) {
            arr_parts.push(i);
            parts_count++;
            parts_count_loop++;
            parts = parts + max;
          }
          if (i === lenstr) {
            help_loop = true;
            let lastElement = arr_parts[arr_parts.length - 1];
            final_count = i - lastElement;
            final_count = final_count + lastElement;
            arr_parts.push(final_count);
          }
        }
        if (help_loop === true) {
          parts_count_loop++;
        }

        let arr = [];
        let liceit = 0;
        let liceitagain = max;
        let see_final = parts_count_loop - 1;
        for (let i = 0; i < parts_count_loop; i++) {
          if (i === see_final) {
            let neednum = i - 1;
            let fix_another_last = arr_parts[neednum];
            let fix_last = arr_parts[i];
            let maketheslicefix = title.slice(fix_another_last, fix_last);
            let final_result = wall + space + " *" + maketheslicefix + "* ";
            arr.push(final_result);
            break;
          }
          let maketheslice = title.slice(liceit, liceitagain);
          let final_result = wall + space + " *" + maketheslice + "* ";
          arr.push(final_result);
          liceit = liceit + max;
          liceitagain = liceitagain + max;
        }
        let titlearr = "";
        let see_final_arr = arr.length - 1;
        for (let i = 0; i < arr.length; i++) {
          if (i === see_final_arr) {
            titlearr = titlearr + arr[i];
            break;
          }
          titlearr = titlearr + arr[i] + "\n";
        }
        title_embed = titlearr;
      } else {
        if (lenstr < moremax) {
          let getspaces = max - lenstr;
          if (getspaces === 0) {
            let spacessums = space;
            for (let i = 0; i < getspaces; i++) {
              spacessums = spacessums + space;
            }
            let titletoembed = wall + space + " *" + title + "* ";
            title_embed = titletoembed;
          } else {
            let spacessums = "";
            for (let i = 0; i < getspaces; i++) {
              spacessums = spacessums + space;
            }
            let titletoembed = wall + space + " *" + title + "* ";
            title_embed = titletoembed;
          }
        }
      }
    } else {
      throw new TypeError("MessageEmbed title must be a string.");
    }
    this.title = title_embed;
    return this;
  }

  /**
   * Transforms the embed to a plain object.
   * @returns {APIEmbed} The raw data of this embed
   */
  toJSON() {
    return {
      px: this.px,
      title: this.title,
      description: this.description,
      timestamp: this.timestamp && new Date(this.timestamp),
      fields: this.fields,
      footer: this.footer,
    };
  }

  /**
   * Normalizes field input and verifies strings.
   * @param {string} name The name of the field
   * @param {string} value The value of the field
   * @returns {EmbedField}
   */
  static normalizeField(name, value) {
    return {
      name: Util.verifyString(name, RangeError, "EMBED_FIELD_NAME", false),
      value: Util.verifyString(value, RangeError, "EMBED_FIELD_VALUE", false),
    };
  }

  /**
   * Normalizes field input and resolves strings.
   * @param {...EmbedFieldData|EmbedFieldData[]} fields Fields to normalize
   * @returns {EmbedField[]}
   */
  static normalizeFields(...fields) {
    return fields.flat(2).map((field) => this.normalizeField(field.name, field.value));
  }
};