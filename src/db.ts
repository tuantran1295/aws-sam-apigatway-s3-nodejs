export async function queryDatabase(
    templateId: string,
    dealershipId: string,
    startDate: string,
    endDate: string
): Promise<any[]> {
    //
    return [
        { templateId: templateId, dealershipId: dealershipId, startDate: startDate, endDate: endDate },
    ];
}
