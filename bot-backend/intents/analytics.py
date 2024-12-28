from utils.db import get_database

# Handle top products query
def handle_top_products():
    db = get_database()
    most_hovered = db["hoveranalytics"].aggregate([
        {
            "$lookup": {
                "from": "cars",
                "localField": "carId",
                "foreignField": "_id",
                "as": "car",
            },
        },
        {"$unwind": "$car"},
        {"$sort": {"count": -1}},
        {"$limit": 3},
        {"$project": {"carName": "$car.name", "totalHoverCount": "$count"}},
    ])
    return "\n".join(
        [f"{i+1}. {item['carName']} ({item['totalHoverCount']} hovers)" for i, item in enumerate(most_hovered)]
    )

# Handle hover overview query
def handle_hover_overview():
    db = get_database()
    total_hovers = db["hoveranalytics"].aggregate([
        {"$group": {"_id": None, "total": {"$sum": "$count"}}},
    ])
    total = next(total_hovers, {"total": 0})["total"]
    return f"Total hovers recorded: {total}"

# Handle products with zero hovers
def handle_zero_hovers():
    db = get_database()
    cars_without_hovers = db["cars"].aggregate([
        {
            "$lookup": {
                "from": "hoveranalytics",
                "localField": "_id",
                "foreignField": "carId",
                "as": "hoverData",
            },
        },
        {"$match": {"hoverData": {"$size": 0}}},
    ])
    results = [car["name"] for car in cars_without_hovers]
    if not results:
        return "All products have at least one hover!"
    return f"Products with zero hovers: {', '.join(results)}"

# Handle hover count by category
def handle_category_hover_count():
    db = get_database()
    category_data = db["hoveranalytics"].aggregate([
        {
            "$lookup": {
                "from": "cars",
                "localField": "carId",
                "foreignField": "_id",
                "as": "car",
            },
        },
        { "$unwind": "$car" },
        {
            "$group": {
                "_id": "$car.type",
                "totalHoverCount": { "$sum": "$count" },
            }
        },
        { "$sort": { "totalHoverCount": -1 } },
    ])

    if not category_data:
        return "No hover data available by category."
    
    return "\n".join(
        [f"{item['_id']}: {item['totalHoverCount']} hovers" for item in category_data]
    )

# General intent handling function
def handle_analytics_query(intent_name, parameters=None):
    # Map intents to their respective handlers
    intent_handlers = {
        "What are the top products": handle_top_products,
        "Hover Overview": handle_hover_overview,
        "Products with Zero Hovers": handle_zero_hovers,
        "Category Hover Count": handle_category_hover_count,
    }

    # Call the respective handler or return a fallback response
    handler = intent_handlers.get(intent_name)
    if handler:
        return handler()
    return "Sorry, I cannot process your request."
