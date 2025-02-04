/* **************************************************************** */
/* GRAPH QL                                                         */
/* **************************************************************** */
function getInfo(organizationId) {

	const query = `query Quotas($organizationId: ID!) { organization(id: $organizationId) { __typename propertyCount: properties { __typename pageMetadata { __typename totalEntries }} productCount: records { __typename pageMetadata { __typename totalEntries }} digitalAssetCount: digitalAssets { __typename pageMetadata { __typename totalEntries }} localeCount: locales { __typename pageMetadata { __typename totalEntries }} dataInheritanceHierarchyCount: dataInheritanceHierarchies { __typename pageMetadata { __typename totalEntries }} computedPropertiesCount: properties(type: COMPUTED_PROPERTY) { __typename pageMetadata { __typename totalEntries }} localizablePropertiesCount: properties(localizable: LOCALIZABLE) { __typename pageMetadata { __typename totalEntries }} localizableComputedPropertiesCount: properties( type: COMPUTED_PROPERTY localizable: LOCALIZABLE ) { __typename pageMetadata { __typename totalEntries }} filterablePropertyCount: properties(filterability: [FULL, PARENT_ONLY]) { __typename pageMetadata { __typename totalEntries }} productSimpleListCount: lists(entityType: RECORD, listType: SIMPLE) { __typename pageMetadata { __typename totalEntries }} digitalAssetSimpleListCount: lists(entityType: DIGITAL_ASSET, listType: SIMPLE) { __typename pageMetadata { __typename totalEntries }} digitalAssetSynchronizedListCount: lists( entityType: DIGITAL_ASSET listType: SYNCHRONIZED ) { __typename pageMetadata { __typename totalEntries }} quotas { __typename name maxValue }}}`;

	const variables = {
		"organizationId": organizationId
	};

	const result = salsify_graphql_request(query, variables);
	return result;
}

/* **************************************************************** */
/* PARSE                                                            */
/* **************************************************************** */

function getCounts(organizationData, key, config) {
	const currentKey = config[key].current;
	const maxKey = config[key].max;
	if (!organizationData[currentKey]) return { currentCount: 0, maxCount: 0 }; // Handle missing keys
	const currentPageMetadata = organizationData[currentKey].page_metadata;
	const currentCount = currentPageMetadata ? currentPageMetadata.total_entries : 0;
	const maxCount = getMax(organizationData.quotas, maxKey);
	return { currentCount, maxCount };
}

function getMax(quotas, key) {
	for (const quota of quotas) {
		if (quota.name === key && quota.max_value !== -1) {
			return quota.max_value;
		}
	}
	return 0;
}

function flatten(data, config) {
	const organizationData = data.data.organization;
	const counts = {};

	for (const key in config) {
		if (config.hasOwnProperty(key)) {
			const { tolerance, current, max } = config[key];
			const { currentCount, maxCount } = getCounts(organizationData, key, config);
			let toleranceValue = parseFloat(tolerance) / 100;
			toleranceValue = parseFloat(toleranceValue.toFixed(3)); // Truncate to 3 decimal digits
			let usage = maxCount !== 0 ? currentCount / maxCount : 0;
			usage = parseFloat(usage.toFixed(3)); // Truncate to 3 decimal digits

			counts[key.charAt(0).toUpperCase() + key.slice(1)] = {
				"Current": currentCount,
				"Max": maxCount,
				"Tolerance": toleranceValue,
				"Usage": usage,
				"Warning": usage > toleranceValue
			};
		}
	}

	return counts;
}

function countWarnings(usageInfo) {
	return Object.values(usageInfo).filter(info => info.Warning === true).length;
}

/* **************************************************************** */
/* EMAIL                                                            */
/* **************************************************************** */

function generateHtmlTable(data) {
    // Define style constants
    const tableStyle = 'border-collapse: collapse; width: 100%; text-align: center; border: 1px solid black;';
    const headerRowStyle = 'background-color: #000; color: #fff;';
    const cellStyle = 'padding: 4px; border: 1px solid black;';
    const warningColor = 'color: red;';
    const defaultColor = 'color: black;';
    const defaultRowColor = 'background-color: white;';

    // Generate HTML table with predefined styles
    let html = `<table style="${tableStyle}">`;
    // Create table header with predefined styles
    html += `<tr style="${headerRowStyle}">`;
    html += `<th style="${cellStyle}">Feature</th>`;
    html += `<th style="${cellStyle}">Current</th>`;
    html += `<th style="${cellStyle}">Max</th>`;
    html += `<th style="${cellStyle}">Tolerance</th>`;
    html += `<th style="${cellStyle}">Usage</th>`;
    html += `<th style="${cellStyle}">Warning</th>`;
    html += '</tr>';

    // Iterate over each entry in the data object
    for (const [key, value] of Object.entries(data)) {
        // Determine row background color and text color based on the Warning value
        const rowColor = value.Warning ? defaultRowColor : defaultRowColor;
        const textColor = value.Warning ? warningColor : defaultColor;

        // Generate HTML for each row with predefined styles
        html += `<tr style="${rowColor}">`;
        html += `<td style="${cellStyle}${textColor}">${key}</td>`;
        html += `<td style="${cellStyle}${textColor}">${formatNumber(value.Current)}</td>`;
        html += `<td style="${cellStyle}${textColor}">${formatNumber(value.Max)}</td>`;
        html += `<td style="${cellStyle}${textColor}">${(value.Tolerance * 100).toFixed(1)}%</td>`;
        html += `<td style="${cellStyle}${textColor}">${(value.Usage * 100).toFixed(1)}%</td>`;
        html += `<td style="${cellStyle}${textColor}">${value.Warning ? 'Yes' : 'No'}</td>`;
        html += '</tr>';
    }
    html += '</table>';
    return html;
}

function formatNumber(number) {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* **************************************************************** */
/* CONFIGURATION                                                    */
/* **************************************************************** */

const config = {
	"property": {
		"tolerance": "1",
		"current": "property_count",
		"max": "property_count"
	},
    "localized": {
        "tolerance": "60",
        "current": "localizable_properties_count",
        "max": "localizable_properties_count"
    },
    "computed": {
        "tolerance": "60",
        "current": "computed_properties_count",
        "max": "computed_properties_count"
    },
	"record": {
		"tolerance": "50",
		"current": "product_count",
		"max": "product_count"
	},
	"locale": {
		"tolerance": "60",
		"current": "locale_count",
		"max": "locale_count"
	},
    "inheritance": {
        "tolerance": "60",
        "current": "data_inheritance_hierarchy_count",
        "max": "data_inheritance_hierarchy_count"
    }
};

/* **************************************************************** */
/* DEBUG                                                            */
/* **************************************************************** */


function Sting(path, content) {
	web_request('https://salsify.proxy.beeceptor.com/' + path, 'post', api_version = content)
}


/* **************************************************************** */
/* MAIN                                                             */
/* **************************************************************** */
const organizationId = flow.organization_id;
Sting("organizationId", organizationId);

const configuration = getInfo(organizationId);
Sting("configuration", configuration);

const usageInfo = flatten(configuration, config);
Sting("usageInfo", usageInfo);

var htmlTable = generateHtmlTable(usageInfo);
Sting("htmlTable", htmlTable);

if (countWarnings(usageInfo) > 0) {
	// We need to send a Notification
	htmlTable = generateHtmlTable(usageInfo);
}
htmlTable;
