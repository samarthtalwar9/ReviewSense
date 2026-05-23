import csv
import os
import random

# Product lists to inject variety
PRODUCTS = [
    "smartwatch", "wireless headphones", "mechanical keyboard", "ultra-wide monitor",
    "noise-cancelling earbuds", "ergonomic office chair", "portable power bank",
    "robot vacuum cleaner", "smart home thermostat", "security camera", "gaming mouse",
    "USB-C docking station", "graphics card", "fitness tracker", "electric toothbrush"
]

FEATURES = [
    "battery life", "sound signature", "screen resolution", "tactile response",
    "charging speed", "software integration", "ergonomic support", "suction power",
    "wireless range", "build quality", "customer support response", "packaging design",
    "setup process", "material durability", "value for money"
]

# Review templates to generate natural human-like phrases
POS_TEMPLATES = [
    "Absolutely love this {product}! The {feature} is amazing and works perfectly.",
    "This {product} exceeded my expectations. Very high quality and fast shipping.",
    "Best purchase of the year! The {feature} is a complete game changer.",
    "Extremely satisfied with my new {product}. The {feature} makes it so easy to use.",
    "Highly recommend this {product} to anyone looking for a reliable {feature}.",
    "Super fast delivery and the {product} works wonderfully. Five stars all the way!",
    "Great value for money. The {product} is solid and {feature} is fantastic.",
    "So glad I bought this! It has made my daily workflow much more efficient.",
    "Outstanding performance! The {product} is incredibly fast and responsive.",
    "Perfect customer support and a great {product}. Will definitely buy again!",
    "I was skeptical at first, but this {product} is brilliant. The {feature} is top notch.",
    "The {product} is incredibly sleek and modern. Highly recommend for the {feature} alone.",
    "Really impressed with how long the {product} lasts. Excellent {feature}!",
    "This is exactly what I was looking for. The {product} feels premium and performs well.",
    "Amazing product. Very easy setup and the {feature} is super smooth."
]

NEG_TEMPLATES = [
    "Terrible experience. The {product} broke after just two days of normal use.",
    "Complete waste of money. The {product} feels cheap and the {feature} does not work.",
    "Worst {product} I have ever bought. Very laggy, buggy, and frustrating.",
    "Extremely disappointed. The {product} arrived damaged and customer service is non-responsive.",
    "Do not buy! The {product} has a horrible {feature} and is completely unusable.",
    "Very slow shipping and the {product} is of very poor, cheap quality.",
    "I highly regret this purchase. The {product} does not match the online description at all.",
    "Defective item. The {feature} fails every single time I try to run it.",
    "High price tag but very cheap plastic build. The {product} is not worth the money.",
    "Frustrating experience. The {product} shuts down randomly and lacks proper instructions.",
    "The {product} is a total letdown. The {feature} is awful and completely sluggish.",
    "Avoid this seller. The {product} stopped working after a week and no reply from support.",
    "Disappointing performance. The {product} is too heavy and the {feature} is bad.",
    "This {product} is completely useless. Do not waste your hard-earned cash.",
    "Poor engineering. The {feature} is buggy and customer support was extremely rude."
]

NEUT_TEMPLATES = [
    "It is okay I guess. Nothing special but the {product} does the basic job.",
    "Average quality {product}. The {feature} works fine but could be improved.",
    "Decent {product} for the price. Not outstanding but acceptable for daily use.",
    "The {product} is fine, but the shipping delivery took much longer than expected.",
    "Mixed feelings about this. The {product} looks good but the {feature} is just average.",
    "It works as described, but I expected a bit more features for this cost.",
    "Not bad, but not great either. Just a standard, ordinary {product}.",
    "The {product} does what it is supposed to do. Average overall experience.",
    "Decent purchase, but the {feature} requires some initial configuration.",
    "A standard {product}. Nothing particularly good or bad to mention.",
    "The {product} is decent. The {feature} works but the documentation is a bit sparse.",
    "It is a fair deal. Not the best {product} out there, but it gets by.",
    "Mediocre product. The {feature} is alright but the build feels a bit lightweight.",
    "For the price, the {product} is okay. Do not expect premium quality though.",
    "Average performance. It is a functional {product} but nothing to write home about."
]

EXTRA_PHRASES = [
    " Hope this review helps someone.",
    " Just my honest opinion.",
    " Used it for about a week now.",
    " Shipping was average.",
    " Will update this review if anything changes.",
    " The packaging was clean.",
    " Might buy another one for my brother.",
    ""
]

def generate_reviews(num_samples=180):
    dataset = []
    
    # 1. Generate Positive Reviews
    for _ in range(num_samples):
        template = random.choice(POS_TEMPLATES)
        review = template.format(product=random.choice(PRODUCTS), feature=random.choice(FEATURES))
        review += random.choice(EXTRA_PHRASES)
        dataset.append((review.strip(), "Positive"))
        
    # 2. Generate Negative Reviews
    for _ in range(num_samples):
        template = random.choice(NEG_TEMPLATES)
        review = template.format(product=random.choice(PRODUCTS), feature=random.choice(FEATURES))
        review += random.choice(EXTRA_PHRASES)
        dataset.append((review.strip(), "Negative"))
        
    # 3. Generate Neutral Reviews
    for _ in range(num_samples):
        template = random.choice(NEUT_TEMPLATES)
        review = template.format(product=random.choice(PRODUCTS), feature=random.choice(FEATURES))
        review += random.choice(EXTRA_PHRASES)
        dataset.append((review.strip(), "Neutral"))
        
    random.shuffle(dataset)
    return dataset

def main():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.join(current_dir, "dataset")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "reviews.csv")
    
    # Generate 180 of each sentiment = 540 rows (exceeds the 500+ requirement)
    reviews_dataset = generate_reviews(num_samples=180)
    
    with open(output_path, "w", encoding="utf-8", newline="") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["review", "sentiment"])
        writer.writerows(reviews_dataset)
        
    print(f"Generated {len(reviews_dataset)} balanced reviews and saved to {output_path}")

if __name__ == "__main__":
    main()
