import type { Email } from "inferred-types";

export interface OpenAiModelListItem {
  id: string;
  object: "model";
  created: EpochTimeStamp;
  /** likely always going to be "system" */
  owned_by: string;
}

export interface OpenAiModelList {
  object: "list";
  data: OpenAiModelListItem[];
}

/**
 * Represents the result of a moderation check for a single piece of content.
 * Corresponds to an element in the `results` array from the OpenAI Moderation API response.
 */
export interface OpenAiModerationResult {
  /**
   * Indicates whether the content was flagged as violating OpenAI's policy.
   * A value of `true` means that the content has been deemed non-compliant.
   *
   * @see https://platform.openai.com/docs/api-reference/moderations/object
   */
  flagged?: boolean;

  /**
   * Contains a list of categories, each represented by a boolean. A value of `true`
   * indicates that the category applies to the content. The categories correspond
   * directly to OpenAI’s content policy sections.
   *
   * @see https://platform.openai.com/docs/api-reference/moderations/object
   */
  categories?: {
    /**
     * Content that includes sexual or erotic details. This can encompass explicit
     * language, descriptions of sexual acts, or erotic undertones not necessarily
     * involving minors.
     *
     * @see https://platform.openai.com/docs/guides/moderation
     */
    "sexual"?: boolean;
    /**
     * Content that expresses, incites, or promotes hate based on race, gender, ethnicity,
     * religion, nationality, sexual orientation, disability status, or caste. This
     * includes use of slurs or pejorative terms aimed at a protected group.
     * When directed at a non-protected group (e.g., “chess players”), it is
     * considered harassment rather than hate.
     *
     * @see https://platform.openai.com/docs/guides/moderation
     */
    "hate"?: boolean;
    /**
     * Content that involves targeted harassment, bullying, or threatening behavior
     * directed at any individual or group (not necessarily protected). This includes
     * insults, personal attacks, or incitement to harass.
     *
     * @see https://platform.openai.com/docs/guides/moderation
     */
    "harassment"?: boolean;
    /**
     * Content related to self-harm, including expressions of self-harm ideation,
     * self-harm behavior, or discussion about suicidal thoughts.
     *
     * @see https://platform.openai.com/docs/guides/moderation
     */
    "self-harm"?: boolean;
    /**
     * Content that involves sexual activities or sexual content specifically
     * involving minors. This category is strictly disallowed and heavily restricted.
     *
     * @see https://platform.openai.com/docs/guides/moderation
     */
    "sexual/minors"?: boolean;
    /**
     * Content that both expresses hate and includes a threat of violence or harm
     * directed at a protected group. This includes explicit threats or calls for
     * violence against such a group.
     *
     * @see https://platform.openai.com/docs/guides/moderation
     */
    "hate/threatening"?: boolean;
    /**
     * Content that depicts graphic violence or gore, which may include detailed
     * descriptions of harm, torture, or other extreme violent acts.
     *
     * @see https://platform.openai.com/docs/guides/moderation
     */
    "violence/graphic"?: boolean;
    /**
     * Content expressing an intention to self-harm. This includes statements
     * indicating one’s plan or desire to end one’s life or inflict self-injury.
     *
     * @see https://platform.openai.com/docs/guides/moderation
     */
    "self-harm/intent"?: boolean;
    /**
     * Content providing instructions, tips, or methods for suicide or self-harm
     * behaviors, potentially enabling self-harm acts.
     *
     * @see https://platform.openai.com/docs/guides/moderation
     */
    "self-harm/instructions"?: boolean;
    /**
     * Content that involves explicit or implied threats of harm or violence
     * aimed at an individual or group, but not based on a protected characteristic.
     *
     * @see https://platform.openai.com/docs/guides/moderation
     */
    "harassment/threatening"?: boolean;

    /**
     * Content involving references to or depictions of violence or harm towards
     * individuals or groups. May include calls for violence or endorsement of
     * violent activities.
     *
     * @see https://platform.openai.com/docs/guides/moderation
     */
    "violence"?: boolean;
  };

  /**
   * Provides numerical scores corresponding to each category, reflecting the
   * likelihood (on a scale from 0.0 to 1.0) that the text belongs to that category.
   * Higher scores indicate higher confidence of the content matching that category.
   *
   * @see https://platform.openai.com/docs/api-reference/moderations/object
   */
  category_scores: {
    /**
     * Likelihood that the content includes sexual or erotic detail.
     */
    "sexual": number;
    /**
     * Likelihood that the content expresses hate based on a protected characteristic.
     */
    "hate": number;
    /**
     * Likelihood that the content targets someone with harassment or malicious behavior.
     */
    "harassment": number;
    /**
     * Likelihood that the content involves self-harm discussion or ideation.
     */
    "self-harm": number;
    /**
     * Likelihood that the content includes sexual elements or scenarios involving minors.
     */
    "sexual/minors": number;
    /**
     * Likelihood that the content is hateful and threatening to a protected group.
     */
    "hate/threatening": number;
    /**
     * Likelihood that the content depicts graphic descriptions of extreme violence.
     */
    "violence/graphic": number;
    /**
     * Likelihood that the content indicates an actual plan or intent to self-harm.
     */
    "self-harm/intent": number;
    /**
     * Likelihood that the content provides instructions or methods to carry out self-harm.
     */
    "self-harm/instructions": number;
    /**
     * Likelihood that the content contains threats directed at an individual or group
     * (non-protected).
     */
    "harassment/threatening": number;
    /**
     * Likelihood that the content involves violence, harm, or promotion of violent acts.
     */
    "violence": number;
  };
}

/**
 * Represents the entire response object from the OpenAI Moderation API.
 * It contains metadata about the moderation request along with an array
 * of results that describe the moderation outcome for each submitted input.
 */
export interface OpenAiModerations {
  /**
   * A unique identifier for the moderation request, prefixed with "modr-".
   * This helps reference or track the specific moderation request.
   *
   * @example "modr-5MWoLO"
   * @see https://platform.openai.com/docs/api-reference/moderations/object
   */
  id: `modr-${string}`;
  /**
   * The name of the model used to perform the moderation checks (e.g., "text-moderation-004").
   * This can differ from the model used to generate the content.
   *
   * @example "text-moderation-004"
   * @see https://platform.openai.com/docs/api-reference/moderations/object
   */
  model: string;
  /**
   * An array of moderation results, each corresponding to a single piece of content
   * that was submitted for moderation. Each result indicates whether the content
   * was flagged, and if so, which categories were triggered.
   *
   * @see OpenAiModerationResult
   * @see https://platform.openai.com/docs/api-reference/moderations/object
   */
  results: OpenAiModerationResult[];
}

export interface OpenAiUser {
  object: `organization.${string}`;
  id: `user_${string}`;
  name: string;
  email: Email;
  role: string;
  added_at: EpochTimeStamp;
}
