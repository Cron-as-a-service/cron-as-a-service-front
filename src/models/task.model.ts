export interface TaskDto {
    Id: string;
    Name: string;
    Cron: string;
    FunctionType: string;
    UserId: string;
    HttpMethod: string;
    TargetUrl: string;
    Filters: string[];
    ObjectId: string;
    Differential: string;
    CreatedAt: string;
    UpdatedAt: string;
}

export interface Task {
    id: string;
    name: string;
    cron: string;
    function: string;
    userId: string;
    httpMethod: string;
    targetUrl: string;
    filters: string[];
    objectId: string;
    differential: string;
    createdAt: string;
    updatedAt: string;
}