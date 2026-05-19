export declare function createWorkspaceProfile(config: any, state: any): {
    client: any;
    chapter: any;
    lead: any;
    approvedCriteria: any;
    readyCriteria: any;
    blockedCriteria: any;
    evidenceCount: any;
    completedActions: any;
    completionRate: number;
    updatedAt: any;
};
export declare function createSaasMetrics(config: any, state: any, scoreResult: any, warnings?: any[]): {
    profile: {
        client: any;
        chapter: any;
        lead: any;
        approvedCriteria: any;
        readyCriteria: any;
        blockedCriteria: any;
        evidenceCount: any;
        completedActions: any;
        completionRate: number;
        updatedAt: any;
    };
    kpis: {
        label: string;
        value: number;
        suffix: string;
        detail: any;
    }[];
    risk: string;
    segments: {
        name: string;
        need: string;
        package: string;
        successMetric: any;
    }[];
    experiments: {
        title: string;
        hypothesis: string;
        metric: string;
        owner: any;
    }[];
    board: {
        stage: string;
        playbook: string;
        health: string;
    }[];
    milestones: {
        window: string;
        outcome: string;
        evidence: string;
    }[];
    automations: {
        name: string;
        trigger: string;
        action: string;
    }[];
    pricing: {
        tier: string;
        audience: any;
        promise: string;
        price: string;
    }[];
    governance: {
        name: string;
        status: string;
        detail: string;
    }[];
};
export declare function buildSaasMarkdown(config: any, state: any, scoreResult: any, warnings?: any[]): string;
