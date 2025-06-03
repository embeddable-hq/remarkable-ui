// Embeddable Libraries
import {
	defineComponent,
	EmbeddedComponentMeta,
	Inputs,
} from "@embeddable.com/react";
import { Value, loadData, DataResponse, Dimension } from "@embeddable.com/core";

//Local Libraries
import SingleSelectDropdown from "./index";
import {
	title,
	description,
	placeholder,
	dataset,
	dimension,
} from "../../../constants/commonChartInputs";

export type SingleSelectDropdownProps = {
	description?: string;
	dimension: Dimension;
	onChangeSelectedValue?: (selectedValue: string) => void;
	placeholder?: string;
	results: DataResponse;
	preSelectedValue: string;
	setSearchValue: (search: string) => void;
	title?: string;
};

export const meta = {
	name: "SingleSelectDropdown",
	label: "Single Select Dropdown",
	category: "Controls",
	defaultWidth: 200,
	defaultHeight: 40,
	inputs: [
		{ ...dataset },
		{ ...dimension, label: "Dimension (to load Dropdown values)" },
		{ ...title },
		{ ...description },
		{ ...placeholder, defaultValue: "Select values..." },
		{
			name: "preSelectedValue",
			type: "string",
			label: "Selected Value",
			category: "Pre-configured variables",
		},
	],
	events: [
		{
			name: "onChangeSelectedValue",
			label: "Change",
			properties: [
				{
					name: "value",
					type: "string",
				},
			],
		},
	],
	variables: [
		{
			name: "Single-select dropdown value",
			type: "string",
			defaultValue: Value.noFilter(),
			inputs: ["preSelectedValue"],
			events: [{ name: "onChangeSelectedValue", property: "value" }],
		},
	],
} as const satisfies EmbeddedComponentMeta;

type SingleSelectDropdownState = {
	searchValue?: string;
};

export default defineComponent(SingleSelectDropdown, meta, {
	props: (
		inputs: Inputs<typeof meta>,
		[state, setState]: [
			SingleSelectDropdownState,
			(state: SingleSelectDropdownState) => void,
		],
	) => {
		return {
			...inputs,
			setSearchValue: (searchValue: string) =>
				setState({ searchValue: searchValue }),
			results: loadData({
				from: inputs.dataset,
				dimensions: [inputs.dimension],
				limit: 200,
				filters: state?.searchValue
					? [
							{
								operator: "contains",
								property: inputs.dimension,
								value: state?.searchValue,
							},
						]
					: undefined,
			}),
		};
	},
	events: {
		onChangeSelectedValue: (selectedValue: string) => {
			return {
				value: selectedValue || Value.noFilter(),
			};
		},
	},
});
