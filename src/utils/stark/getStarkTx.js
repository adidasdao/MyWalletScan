import axios from "axios";

async function getStarkTx(address) {
    try {
        let tx = 0;
        let hasNextPage;
        let endCursor;
        const url = "https://starkscan.stellate.sh/";
        const headers = {
            'authority': 'starkscan.stellate.sh',
            'accept': 'application/json',
            'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
            'content-type': 'application/json',
        }
        const Json_data = {
            'query': 'query TransactionsTableQuery(\n  $first: Int!\n  $after: String\n  $input: TransactionsInput!\n) {\n  ...TransactionsTablePaginationFragment_transactions_2DAjA4\n}\n\nfragment TransactionsTableExpandedItemFragment_transaction on Transaction {\n  entry_point_selector_name\n  calldata_decoded\n  entry_point_selector\n  calldata\n  initiator_address\n  initiator_identifier\n  main_calls {\n    selector\n    selector_name\n    calldata_decoded\n    selector_identifier\n    calldata\n    contract_address\n    contract_identifier\n    id\n  }\n}\n\nfragment TransactionsTablePaginationFragment_transactions_2DAjA4 on Query {\n  transactions(first: $first, after: $after, input: $input) {\n    edges {\n      node {\n        id\n        ...TransactionsTableRowFragment_transaction\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment TransactionsTableRowFragment_transaction on Transaction {\n  id\n  transaction_hash\n  block_number\n  transaction_status\n  transaction_type\n  timestamp\n  initiator_address\n  initiator_identifier\n  initiator {\n    is_social_verified\n    id\n  }\n  main_calls {\n    selector_identifier\n    id\n  }\n  ...TransactionsTableExpandedItemFragment_transaction\n}\n',
            'variables': {
                'first': 30,
                'after': null,
                'input': {
                    'initiator_address': address,
                    'transaction_types': [
                        'INVOKE_FUNCTION'
                    ],
                    'sort_by': 'timestamp',
                    'order_by': 'desc',
                    'min_block_number': null,
                    'max_block_number': null,
                    'min_timestamp': null,
                    'max_timestamp': null
                }
            }
        }
        const response = await axios.post(url, Json_data, {headers: headers});
        tx += response.data.data['transactions']['edges'].length;
        hasNextPage = response.data.data['transactions']['pageInfo']['hasNextPage'];
        if (hasNextPage === true) {
            endCursor = response.data.data['transactions']['pageInfo']['endCursor'];
            while (hasNextPage) {
                Json_data['variables']['after'] = endCursor;
                const response = await axios.post(url, Json_data, {headers: headers});
                hasNextPage = response.data.data['transactions']['pageInfo']['hasNextPage'];
                endCursor = response.data.data['transactions']['pageInfo']['endCursor'];
                tx += response.data.data['transactions']['edges'].length;
            }
        }
        return {tx: tx};
    } catch (error) {
        console.error(error);
        return {tx: "Error"};
    }
}

export default getStarkTx;
